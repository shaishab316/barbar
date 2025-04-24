import { TUser } from './User.interface';
import User from './User.model';
import { StatusCodes } from 'http-status-codes';
import { Request } from 'express';
import deleteFile from '../../../util/file/deleteFile';
import ServerError from '../../../errors/ServerError';
import { AuthServices } from '../auth/Auth.service';

export const UserServices = {
  async create(userData: Partial<TUser>) {
    const user = await User.findOne({ email: userData.email });

    if (user)
      throw new ServerError(StatusCodes.CONFLICT, 'User already exists');

    await User.create(userData);

    await AuthServices.sendOtp(userData.email!, 'active');
  },

  async edit(req: Request) {
    const userData = req.body as Partial<TUser>;

    const oldAvatar = req?.user?.avatar;

    const updatedUser = await User.findByIdAndUpdate(req?.user!._id, userData, {
      new: true,
      runValidators: true,
    }).select('name avatar email role');

    if (userData?.avatar) await deleteFile(oldAvatar!);

    return updatedUser;
  },

  async list({ page, limit }: Record<string, any>) {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments();

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      users,
    };
  },
};
