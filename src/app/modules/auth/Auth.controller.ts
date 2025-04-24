import { AuthServices } from './Auth.service';
import catchAsync from '../../../util/server/catchAsync';
import config from '../../../config';
import serveResponse from '../../../util/server/serveResponse';

export const AuthControllers = {
  login: catchAsync(async ({ body }, res) => {
    const data = await AuthServices.login(body.email);

    if (!data)
      return serveResponse(res, {
        message: 'Send Otp successfully! Check your email.',
      });

    const { accessToken, refreshToken, user } = data;

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

  sendOtp: catchAsync(async ({ body }, res) => {
    await AuthServices.sendOtp(body.email, 'reset');

    serveResponse(res, {
      message: 'Send Otp successfully! Check your email.',
    });
  }),

  verifyOtp: catchAsync(async ({ body }, res) => {
    const { accessToken, refreshToken, user } = await AuthServices.verifyOtp(
      body.email,
    );

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

  loginWith: catchAsync(async (req, res) => {
    const { accessToken, refreshToken, user } =
      await AuthServices.loginWith(req);

    AuthServices.setRefreshToken(res, refreshToken);

    serveResponse(res, {
      message: 'Login successfully!',
      data: { token: accessToken, user },
    });
  }),
};
