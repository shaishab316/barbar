/* eslint-disable no-console */
import Chat from './Chat.model';
import Message from '../message/Message.model';
import { TSocketHandler } from '../socket/Socket.interface';
import { Server } from 'socket.io';

const chatSocket: TSocketHandler = (io, socket) => {
  const { user } = socket.data;

  socket.on('subscribeToChat', async ({ chatId }: { chatId: string }) => {
    try {
      const chat = await Chat.findOne({
        _id: chatId.oid,
        users: { $all: [user._id.oid] },
      });

      if (!chat) {
        console.log(`❌ Chat room ${chatId} not found`);
        return;
      }

      socket.join(chatId);
      console.log(`${user.name ?? 'Unknown'} subscribed to chat: ${chatId}`);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('sendMessage', async ({ content, chatId }) => {
    if (!content || !chatId) {
      console.log(`❌ Invalid message payload from: ${socket.id}`);
      return;
    }

    try {
      const chat = await Chat.findOne({
        _id: chatId.oid,
        users: { $all: [user._id.oid] },
      }).lean();

      if (!chat) {
        console.log(`❌ Chat room ${chatId} not found`);
        return;
      }

      const newMessage = await Message.create({
        chat: chatId,
        content,
        sender: user._id,
      });

      await updateInbox(io, chat.users);

      io.to(chatId).emit('chatMessageReceived', {
        sender: user,
        content,
        _id: newMessage._id,
        updatedAt: newMessage.createdAt,
      });

      console.log(`🚀 New text message sent successfully to room ${chatId}`);
    } catch (error: any) {
      console.error(`❌ Error sending message: ${error.message || error}`);
    }
  });

  socket.on('deleteMessage', async ({ messageId, roomId: chatId }) => {
    if (!messageId || !chatId) {
      console.log(`❌ Invalid delete request from: ${socket.id}`);
      return;
    }

    try {
      const message = await Message.findOne({
        _id: messageId.oid,
        chat: chatId.oid,
        sender: user._id.oid,
      }).populate('chat', 'users');

      if (!message) {
        console.log(`❌ Message ${messageId} not found`);
        return;
      }

      await Message.findByIdAndDelete(messageId);

      io.to(chatId).emit('messageDeleted', { messageId, roomId: chatId });

      await updateInbox(io, (message.chat as any).users);

      console.log(`✅ Message ${messageId} deleted successfully`);
    } catch (error: any) {
      console.error(`❌ Error deleting message: ${error.message || error}`);
    }
  });
};

const updateInbox = async (io: Server, users: any[]) => {
  await Promise.all(
    users.map(user => io.to(user.toString()).emit('inboxUpdated')),
  );
};

export default chatSocket;
