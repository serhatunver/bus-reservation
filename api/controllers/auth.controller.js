// controllers/auth.controller.js
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import generateToken from '../helpers/generateToken.js';

export const register = async (req, res) => {
  try {
    const { name, surname, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      surname,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = await generateToken(user);
    if (!token) {
      return res.status(500).json({ message: 'Token generation failed' });
    }

    res.json({
      user: { name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json('logout successfully');
  } catch (error) {
    res.status(500).json({
      message: 'Logout error',
      error: error,
    });
  }
};

export const getSession = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
