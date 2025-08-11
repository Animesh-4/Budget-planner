// backend/src/app.js
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

// Import route handlers
const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budget');
const transactionRoutes = require('./routes/transaction');
const userRoutes = require('./routes/user');
const reportRoutes = require('./routes/report');

// Initialize the Express application
const app = express();

// --- Global Middleware ---

// Apply CORS middleware to allow cross-origin requests
app.use(corsMiddleware);

// Middleware to parse incoming JSON payloads
app.use(express.json());

// --- API Routes ---

// A simple health check endpoint to verify the server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Mount the imported route handlers to their specific base paths
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// --- Error Handling Middleware ---

// This middleware must be the last one added to the app.
// It will catch any errors passed to `next()` in your route handlers.
app.use(errorHandler);

module.exports = app;
