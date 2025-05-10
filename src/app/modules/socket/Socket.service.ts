import colors from 'colors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { errorLogger, logger } from '../../../util/logger/logger';
import config from '../../../config';
import auth from '../../middlewares/socketAuth';
import { socketHandlers } from './Socket.constant';

export let io: Server | null;
const onlineUsers = new Set<string>();

export const SocketService = {
  init(server: http.Server) {
    if (!io) {
      io = new Server(server, { cors: { origin: config.allowed_origins } });
      logger.info(colors.green('🔑 Socket server initialized'));
    }

    io.use(auth);

    io.on('connection', socket => {
      const { user } = socket.data;

      logger.info(
        colors.blue(
          `👤 User (${user?.name ?? 'Unknown'}) connected to room: (${user._id})`,
        ),
      );

      this.online(user._id);

      socket.on('disconnect', () => {
        socket.leave(user._id);
        logger.info(
          colors.red(
            `👤 User (${user?.name ?? 'Unknown'}) disconnected from room: (${user._id})`,
          ),
        );

        this.offline(user._id);
      });

      socket.on('error', err => {
        errorLogger.error(colors.red('Socket Error:' + err));
        socket.emit('customError', err.message);
        socket.disconnect();
      });

      this.pulgin(io!, socket);
    });
  },

  updateOnlineState() {
    io?.emit('onlineUsers', Array.from(onlineUsers));
  },

  online(userId: string) {
    onlineUsers.add(userId);
    this.updateOnlineState();
  },

  offline(userId: string) {
    onlineUsers.delete(userId);
    this.updateOnlineState();
  },

  pulgin(io: Server, socket: Socket) {
    socketHandlers.forEach(handler => {
      try {
        handler(io!, socket);
      } catch (error) {
        errorLogger.error(colors.red('Error in socket handler: ' + error));
      }
    });
  },
};
