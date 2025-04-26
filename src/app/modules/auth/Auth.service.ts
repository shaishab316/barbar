import User from '../user/User.model';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './Auth.utils';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { Types } from 'mongoose';
import config from '../../../config';
import { Response } from 'express';
import { userExcludeFields } from '../user/User.constant';
import { TUser } from '../user/User.interface';

export const AuthServices = {
  async login(user: TUser, password: string) {
    if (!(await bcrypt.compare(password, user.password!)))
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not authorized');

    return this.retrieveToken(user._id!);
  },

  async setRefreshToken(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      secure: config.server.node_env !== 'development',
      maxAge: verifyToken(refreshToken, 'refresh').exp! * 1000,
      httpOnly: true,
    });
  },

  async changePassword(
    id: Types.ObjectId,
    { newPassword, oldPassword }: Record<string, string>,
  ) {
    const user = (await User.findById(id).select('+password'))!;

    if (!(await bcrypt.compare(oldPassword, user.password!)))
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not authorized');

    user.password = newPassword;

    await user.save();
  },

  async resetPassword(email: string, password: string) {
    await User.updateOne(
      { email },
      {
        $set: { password },
      },
    );
  },

  async refreshToken(refreshToken: string) {
    const token = refreshToken.split(' ')[0];

    if (!token)
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not logged in!');

    const { userId } = verifyToken(token, 'refresh');

    const user = await User.findById(userId).select('_id');

    if (!user) throw new ServerError(StatusCodes.NOT_FOUND, 'User not found!');

    return this.retrieveToken(user._id);
  },

  async retrieveToken(userId: Types.ObjectId) {
    const accessToken = createToken({ userId }, 'access');
    const refreshToken = createToken({ userId }, 'refresh');

    const userData = await User.findById(userId)
      .select('-' + userExcludeFields.join(' -'))
      .lean();

    return { accessToken, user: userData, refreshToken };
  },
};
