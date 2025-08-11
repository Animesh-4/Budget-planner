// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const authenticateToken = require('../middleware/auth');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword); // Add the new route

// Private routes
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
