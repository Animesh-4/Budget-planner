// backend/src/controllers/authController.js
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await authService.registerUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await authService.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    next(error);
  }
};

// New controller function for handling the forgot password request
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const result = await authService.forgotPassword(email);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
