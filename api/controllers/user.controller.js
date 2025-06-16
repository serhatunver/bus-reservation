import User from '../models/user.model.js';

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .lean();
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('reservations').lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, surname, email, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ name, surname, email, phone });
    await newUser.save();
    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, surname, email, phone } = req.body;

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, surname, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
