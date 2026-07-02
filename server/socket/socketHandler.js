const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Initialize Socket.IO on the HTTP server.
 * Handles authentication via JWT on connection, and provides
 * joinAuction / leaveAuction room management.
 *
 * @param {Object} server - The Node.js HTTP server instance.
 * @returns {Object} io - The Socket.IO server instance.
 */
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware — verify JWT before allowing connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error — no token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      return next(new Error('Authentication error — invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (user: ${socket.userId})`);

    /**
     * Join an auction room to receive real-time bid updates.
     * Expects: { auctionId: string }
     */
    socket.on('joinAuction', (data) => {
      const room = `auction_${data.auctionId}`;
      socket.join(room);
      logger.info(`Socket ${socket.id} joined room ${room}`);
    });

    /**
     * Leave an auction room.
     * Expects: { auctionId: string }
     */
    socket.on('leaveAuction', (data) => {
      const room = `auction_${data.auctionId}`;
      socket.leave(room);
      logger.info(`Socket ${socket.id} left room ${room}`);
    });

    /**
     * Handle disconnection.
     */
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (reason: ${reason})`);
    });
  });

  return io;
};

module.exports = initializeSocket;
