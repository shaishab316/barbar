import ms from 'ms';
import config from '../../../config';
import { generateOtp } from '../auth/Auth.utils';
import { TUser } from '../user/User.interface';
import Otp from './Otp.model';
import { sendEmail } from '../../../util/sendMail';
import { OtpTemplates } from './Otp.template';

export const OtpServices = {
  async send(user: TUser) {
    const otp = generateOtp();

    await Otp.findOneAndUpdate(
      { user: user._id },
      {
        otp,
        otpExp: new Date(Date.now() + ms(config.otpExp)),
      },
      {
        upsert: true,
        new: true,
      },
    );

    await sendEmail({
      to: user.email,
      subject: `Your ${config.server.name} password reset OTP is ${otp}.`,
      html: OtpTemplates.reset(user.name, otp),
    });
  },
};
