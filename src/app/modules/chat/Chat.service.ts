import { Types } from 'mongoose';
import Chat from './Chat.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { TList } from '../query/Query.interface';

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
    const chats = await Chat.aggregate([
      {
        $match: {
          users: { $all: [userId] },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            { $project: { name: 1, avatar: 1 } },
          ],
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'messages',
          let: { chatId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$chat', '$$chatId'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { content: 1 } },
          ],
          as: 'lastMessage',
        },
      },
      { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          avatar: '$user.avatar',
          name: '$user.name',
          message: '$lastMessage.content',
          updatedAt: 1,
          createdAt: 1,
        },
      },
      { $sort: { updatedAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

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
      chats,
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
