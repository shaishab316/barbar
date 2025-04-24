/* eslint-disable no-console */
import colors from 'colors';
import http from 'http';
import { Server } from 'socket.io';
import { logger, errorLogger } from '../logger/logger';
import User from '../../app/modules/user/User.model';
import { verifyToken } from '../../app/modules/auth/Auth.utils';

export let io: Server | null;

const onlineUsers = new Set<string>();

/**
 * Initializes the Socket.io server
 *
 * This function creates a new Socket.io server instance and attaches it to the provided HTTP server.
 * It also sets up the necessary CORS configuration for the server.
 *
 * @param {http.Server} server - The HTTP server instance to attach the Socket.io server to
 */
const socket = (server: http.Server) => {
  io = new Server(server, { cors: { origin: '*' } });
  logger.info(colors.green('🔑 Socket server initialized'));

  io.on('connection', async socket => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        logger.info(colors.yellow(`🔑 No token, disconnecting: ${socket.id}`));
        socket.disconnect();
        return;
      }

      // Authenticate user
      const { email } = verifyToken(token, 'access');

      const user = await User.findOne({ email });

      if (!user) {
        logger.info(
          colors.red(`👤 User not found, disconnecting: ${socket.id}`),
        );
        socket.disconnect();
        return;
      }

      logger.info(
        colors.blue(`👤 User connected: ${user.email} (${socket.id})`),
      );

      // Attach email to socket data for easy access
      socket.data.user = user;

      onlineUsers.add(email);

      io?.emit('onlineUsers', Array.from(onlineUsers));

      /** write socket handlers :> handler(socket, io!) */

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(
          colors.red(`👤 User disconnected: ${user.email} (${socket.id})`),
        );

        onlineUsers.delete(email);
        io?.emit('onlineUsers', Array.from(onlineUsers));
      });
    } catch (error) {
      errorLogger.error(colors.red('🔑 Authentication error:'), error);
      socket.emit('tokenExpired');
      socket.disconnect();
    }
  });
};

export default socket;
