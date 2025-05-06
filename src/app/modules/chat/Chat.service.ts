import { Types } from 'mongoose';
import Chat from './Chat.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const ChatServices = {
  async create(users: Types.ObjectId[]) {
    if (users[0]?.toString() === users[1]?.toString())
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
};
