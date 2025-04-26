import { AuthServices } from './Auth.service';
import catchAsync from '../../../util/server/catchAsync';
import config from '../../../config';
import serveResponse from '../../../util/server/serveResponse';
import { OtpServices } from '../otp/Otp.service';

export const AuthControllers = {
  login: catchAsync(async ({ body }, res) => {
    const { accessToken, refreshToken, user } = await AuthServices.login(
      body.email,
    );

    AuthServices.setRefreshToken(res, refreshToken);

    serveResponse(res, {
      message: 'Login successfully!',
      data: { token: accessToken, user },
    });
  }),

  logout: catchAsync(async (req, res) => {
    Object.keys(req.cookies).forEach(cookie =>
      res.clearCookie(cookie, {
        httpOnly: true,
        secure: config.server.node_env !== 'development',
      }),
    );

    serveResponse(res, {
      message: 'Logged out successfully',
    });
  }),

  changePassword: catchAsync(async (req, res) => {
    await AuthServices.changePassword(req.user!._id!, req.body);

    serveResponse(res, {
      message: 'Password changed successfully!',
    });
  }),

  verifyOtp: catchAsync(async (req, res) => {
    await OtpServices.verify(req.user!._id!, req.body.otp);

    const { accessToken, refreshToken, user } =
      await AuthServices.retrieveToken(req.user!._id!);

    AuthServices.setRefreshToken(res, refreshToken);

    serveResponse(res, {
      message: 'Otp verified successfully!',
      data: { token: accessToken, user },
    });
  }),

  resetPassword: catchAsync(async ({ body, user }, res) => {
    await AuthServices.resetPassword(user!.email!, body.password);

    serveResponse(res, {
      message: 'Password reset successfully!',
    });
  }),

  refreshToken: catchAsync(async ({ cookies }, res) => {
    const { accessToken } = await AuthServices.refreshToken(
      cookies.refreshToken,
    );

    serveResponse(res, {
      message: 'AccessToken generated successfully!',
      data: { token: accessToken },
    });
  }),
};
