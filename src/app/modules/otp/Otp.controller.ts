import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { OtpServices } from './Otp.service';

export const OtpControllers = {
  send: catchAsync(async ({ body }, res) => {
    await OtpServices.send(body.email);

    serveResponse(res, {
      message: 'OTP sent successfully!',
    });
  }),
};
