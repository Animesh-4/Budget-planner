// backend/src/socket/socketHandler.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const registerBudgetEvents = require('./budgetEvents');
const registerUserEvents = require('./userEvents');

/**
 * Initializes the Socket.IO server and sets up event listeners.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 */
const initializeSocket = (io) => {
  // Middleware for authenticating socket connections using JWT
  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided.'));
    }

    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error: Invalid token.'));
      }
      // Attach user information to the socket object for later use
      socket.user = decoded;
      next();
    });
  });

  // Main connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.email} (Socket ID: ${socket.id})`);

    // Register event handlers from other modules
    registerBudgetEvents(io, socket);
    registerUserEvents(io, socket);

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.email} (Socket ID: ${socket.id})`);
      // Additional cleanup logic can go here (e.g., leaving rooms)
    });
  });
};

module.exports = initializeSocket;
