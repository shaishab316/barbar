/* eslint-disable no-console */
import { Server } from 'socket.io';
import './util/prototype'; //! must be first
import startServer from './util/server/startServer';
import config from './config';
import Message from './app/modules/message/Message.model';
import Chat from './app/modules/chat/Chat.model';

export let io: Server | null;

startServer().then(server => {
  if (!io)
    io = new Server(server, {
      cors: { origin: config.server.allowed_origins },
    });

  io.on('connection', socket => {
    console.log('👤 User connected');

    socket.on('disconnect', () => {
      console.log('👤 User disconnected');
    });

    socket.on('error', err => {
      console.log(err);
      socket.disconnect();
    });

    socket.on('sendMessage', async ({ roomId, sender, message }: any) => {
      try {
        const newMessage = await Message.create({
          chat: roomId,
          sender,
          content: message,
        });
        io?.emit(`messageReceived:${roomId}`, newMessage);
        console.log(newMessage);
        const chat = await Chat.findById(roomId);

        chat?.users.forEach(user => {
          io?.emit(`inboxUpdated:${user}`, newMessage);
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
});
