import http from 'http';
import { Server, Socket } from 'socket.io';
import config from '../../../config';
import auth from '../../middlewares/socketAuth';
import { socketHandlers } from './Socket.constant';
import { socketError, socketInfo } from './Socket.utils';

export let io: Server | null;
const onlineUsers = new Set<string>();

export const SocketService = {
  init(server: http.Server) {
    if (!io) {
      io = new Server(server, {
        cors: { origin: config.server.allowed_origins },
      });
      socketInfo('🔑 Socket server initialized');
    }

    io.use(auth);

    io.on('connection', socket => {
      const { user } = socket.data;
      this.online(user._id);

      socketInfo(
        `👤 User (${user?.name ?? 'Unknown'}) connected to room: (${user._id})`,
      );

      socket.on('disconnect', () => {
        socket.leave(user._id);
        this.offline(user._id);

        socketInfo(
          `👤 User (${user?.name ?? 'Unknown'}) disconnected from room: (${user._id})`,
        );
      });

      socket.on('error', err => {
        socketError(socket, err.message);
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
      } catch (error: any) {
        socketError(socket, error.message);
      }
    });
  },
};
