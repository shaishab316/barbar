import ms from 'ms';
import config from '../../../config';
import Otp from './Otp.model';
import { sendEmail } from '../../../util/sendMail';
import { OtpTemplates } from './Otp.template';
import User from '../user/User.model';
import { genSecret } from '../../../util/crypto/genSecret';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { createToken } from '../auth/Auth.utils';

export const OtpServices = {
  async send(email: string) {
    const user = await User.findOne({ email });

    if (!user)
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'You are not authorized.',
      );

    const otp = genSecret(config.otp.length / 2).toUpperCase();

    await Otp.findOneAndUpdate(
      { user: user._id },
      {
        otp,
        otpExp: new Date(Date.now() + ms(config.otp.exp)),
      },
      {
        upsert: true,
        new: true,
      },
    );

    await sendEmail({
      to: email,
      subject: `Your ${config.server.name} password reset OTP is ${otp}.`,
      html: OtpTemplates.reset(user.name, otp),
    });
  },

  async verify(user: Types.ObjectId, otp: string) {
    const validOtp = await Otp.findOne({ user, otp });

    if (!validOtp)
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'You are not authorized.',
      );

    await validOtp.deleteOne();

    return createToken({ userId: user }, 'reset');
  },
};
