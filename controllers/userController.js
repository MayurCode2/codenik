const userService = require('../services/userService');
const User = require('../models/User');

class UserController {
  async register(req, res) {
    try {
      const validatedData = await User.validateRegister(req.body);
      const result = await userService.register(validatedData);
      
      res.status(201).json({
        success: true,
        ...result,
        message: 'Registration successful'
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const validatedData = await User.validateLogin(req.body);
      const result = await userService.login(validatedData);
      
      res.json({
        success: true,
        ...result,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.userId);
      res.json({
        success: true,
        user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await userService.updateProfile(req.userId, req.body);
      res.json({
        success: true,
        user,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async changePassword(req, res) {
    try {
      await userService.changePassword(req.userId, req.body);
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteAccount(req, res) {
    try {
      await userService.deleteAccount(req.userId);
      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UserController();