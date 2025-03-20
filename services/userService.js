const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function generateToken(userId) {
  try {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  } catch (error) {
    throw new Error('Error generating token');
  }
}

async function register(userData) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { username: userData.username }
      ]
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('Email is already registered');
      }
      throw new Error('Username is already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user
    const user = new User({
      ...userData,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function login(credentials) {
  try {
    // Find user by email
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getProfile(userId) {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Error fetching user profile');
  }
}

async function updateProfile(userId, updateData) {
  try {
    // Remove sensitive fields from update data
    const { password, ...safeUpdateData } = updateData;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: safeUpdateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function changePassword(userId, { currentPassword, newPassword }) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteAccount(userId) {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return { message: 'Account deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting account');
  }
}

async function refreshToken(userId) {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    const token = generateToken(userId);
    return { token, user };
  } catch (error) {
    throw new Error('Error refreshing token');
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  generateToken,
  refreshToken,
  verifyToken
};