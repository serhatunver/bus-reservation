// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (user) {
      req.user = user;
    }
    next();
  } catch (err) {
    console.error('Error in optionalAuth:', err);
    next();
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res
        .status(403)
        .json({ message: 'Forbidden: insufficient rights' });
    }
    next();
  };
};
