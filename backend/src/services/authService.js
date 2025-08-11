// backend/src/services/authService.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('./emailService');

const authService = {
  async registerUser(username, email, password) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create(username, email, hashedPassword);
  },

  async loginUser(email, password) {
    const user = await User.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;
    delete user.password_hash;
    return user;
  },

  async findUserById(id) {
    return await User.findById(id);
  },

  /**
   * Handles the forgot password request.
   * Generates a reset token and sends a password reset email.
   * @param {string} email - The user's email address.
   */
  async forgotPassword(email) {
    const user = await User.findByEmail(email);
    if (user) {
      // In a real application, you would generate a token, save its hash to the DB with an expiry,
      // and then send the unhashed token in the email.
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    }
    // For security, always return a success message, even if the user doesn't exist.
    // This prevents attackers from checking which emails are registered.
    return { message: 'If a user with that email exists, a reset link has been sent.' };
  }
};

module.exports = authService;
