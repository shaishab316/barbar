import User from '../user/User.model';
import bcrypt from 'bcrypt';
import { createToken, generateOtp, verifyToken } from './Auth.utils';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { sendEmail } from '../../../util/sendMail';
import { AuthTemplates } from './Auth.template';
import { Types } from 'mongoose';
import config from '../../../config';
import { EUserStatus } from '../user/User.enum';
import downloadImage from '../../../util/file/downloadImage';
import deleteFile from '../../../util/file/deleteFile';
import { Request, Response } from 'express';
import { facebookUser } from './Auth.lib';

export const AuthServices = {
  async login(email: string) {
    const user = (await User.findOne({
      email,
    }))!;

    if (user.status === EUserStatus.ACTIVE) return this.retrieveToken(user._id);

    await this.sendOtp(email, 'active');
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

  async sendOtp(email: string, type: 'reset' | 'active') {
    const user = (await User.findOne({ email }))!;

    const otp = (user.otp = generateOtp()).toString();
    user.otpExp = new Date(Date.now() + 10 * 60 * 1000 * 1000);
    await user.save();

    await sendEmail({
      to: email,
      subject: `Your ${config.server.name} ${type} OTP is ${otp}.`,
      html: AuthTemplates.otp(user.name, otp, type),
    });
  },

  async verifyOtp(email: string) {
    const { _id } = (await User.findOneAndUpdate(
      { email },
      {
        $unset: {
          otp: '',
          otpExp: '',
        },
        $set: {
          status: EUserStatus.ACTIVE,
        },
      },
    ).select('_id'))!;

    return this.retrieveToken(_id);
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
      .select('name avatar email role')
      .lean();

    return { accessToken, user: userData, refreshToken };
  },

  async loginWith({ params: { provider }, body, headers }: Request) {
    const token = headers.authorization?.split(' ')[1];

    switch (provider) {
      case 'facebook':
        if (!token)
          throw new ServerError(
            StatusCodes.UNAUTHORIZED,
            'You are not authorized!',
          );

        return this.facebookLogin(token);
      case 'google':
        return this.googleLogin(body);
      // case 'apple':
      //   break;
      default:
        throw new ServerError(
          StatusCodes.UNAUTHORIZED,
          'You are not authorized!',
        );
    }
  },

  async googleLogin({ email, name, uid, avatar }: any) {
    let user = await User.findOne({ email }).select('+googleId');
    const newAvatar = avatar
      ? await downloadImage(avatar)
      : config.server.default_avatar;

    if (!user)
      user = await User.create({
        email,
        name,
        avatar: newAvatar,
        googleId: uid,
        status: EUserStatus.ACTIVE,
      });
    else {
      if (user.googleId && user.googleId !== uid)
        throw new ServerError(
          StatusCodes.UNAUTHORIZED,
          'You are not authorized',
        );

      if (newAvatar && user.avatar !== newAvatar) {
        const oldAvatar = user.avatar;
        user.avatar = newAvatar;
        if (oldAvatar) await deleteFile(oldAvatar);
      }

      Object.assign(user, { name, status: EUserStatus.ACTIVE });
      await user.save();
    }

    return this.retrieveToken(user._id);
  },

  async facebookLogin(token: string) {
    const userData = await facebookUser(token);
    const avatar = userData?.picture?.data?.url;

    let user = await User.findOne({ facebookId: userData.id }).select(
      '+facebookId',
    );

    const newAvatar = avatar
      ? await downloadImage(avatar)
      : config.server.default_avatar;

    if (!user)
      user = await User.create({
        name: userData.name,
        email: userData.email,
        avatar: newAvatar,
        facebookId: userData.id,
        status: EUserStatus.ACTIVE,
      });
    else {
      if (newAvatar && user.avatar !== newAvatar) {
        const oldAvatar = user.avatar;
        user.avatar = newAvatar;
        if (oldAvatar) await deleteFile(oldAvatar);
      }

      Object.assign(user, { name: userData.name, status: EUserStatus.ACTIVE });
      await user.save();
    }

    return this.retrieveToken(user._id);
  },
};
