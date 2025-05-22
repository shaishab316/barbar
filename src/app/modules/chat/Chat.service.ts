import { Types } from 'mongoose';
import Chat from './Chat.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { TList } from '../query/Query.interface';
import Message from '../message/Message.model';

export const ChatServices = {
  async create(users: Types.ObjectId[]) {
    if (users[0].equals(users[1]))
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You cannot create a chat with yourself',
      );

    const chat = await Chat.findOne({
      users: { $all: users.sort() },
    });

    if (chat) return chat;

    return Chat.create({ users });
  },

  async list({ page, limit }: TList, userId: Types.ObjectId) {
    const chats = await Chat.find({
      users: { $all: [userId] },
    })
      .sort('-updatedAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('users', 'name avatar')
      .lean();

    const chatData = await Promise.all(
      chats.map(async chat => {
        const otherUser = chat.users.find(
          (user: Types.ObjectId) => !user._id.equals(userId),
        );

        const lastMessage = await Message.findOne({
          chat: chat._id,
          sender: otherUser,
        })
          .sort('-updatedAt')
          .select('content updatedAt');

        return {
          ...otherUser,
          _id: chat._id,
          message: lastMessage?.content,
          date: lastMessage?.updatedAt,
        };
      }),
    );

    const total = await Chat.countDocuments({
      users: { $all: [userId] },
    });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      chats: chatData,
    };
  },

  async delete(chatId: Types.ObjectId, userId: Types.ObjectId) {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $all: [userId] },
    });

    if (!chat)
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to delete this chat.',
      );

    return Chat.findByIdAndDelete(chatId);
  },
};
