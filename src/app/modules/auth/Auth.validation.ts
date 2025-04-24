import { z } from 'zod';
import bcrypt from 'bcrypt';
import User from '../user/User.model';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';

export const AuthValidations = {
  login: z.object({
    body: z
      .object({
        email: z.string(),
        password: z.string(),
      })
      .superRefine(async ({ email, password }) => {
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password!)))
          throw new ServerError(
            StatusCodes.UNAUTHORIZED,
            'You are not authorized',
          );
      }),
  }),

  passwordChange: z.object({
    body: z.object({
      oldPassword: z
        .string()
        .min(1, 'Old Password is required')
        .min(6, 'Old Password must be at least 6 characters long'),
      newPassword: z
        .string()
        .min(1, 'New Password is required')
        .min(6, 'New Password must be at least 6 characters long'),
    }),
  }),

  refreshToken: z.object({
    cookies: z.object({
      refreshToken: z.string({
        required_error: 'refreshToken is missing',
      }),
    }),
  }),

  loginWith: z.object({
    params: z.object({
      provider: z.enum(['facebook', 'google', 'apple'], {
        errorMap: () => ({
          message: 'Provider must be one of facebook, google, or apple',
        }),
      }),
    }),
  }),

  sendOtp: z.object({
    body: z.object({
      email: z.string().superRefine(async email => {
        if (!(await User.exists({ email })))
          throw new ServerError(StatusCodes.NOT_FOUND, 'User does not exist');
      }),
    }),
  }),

  verifyOtp: z.object({
    body: z
      .object({
        email: z.string(),
        otp: z.coerce.number(),
      })
      .superRefine(async ({ email, otp }) => {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || new Date(user.otpExp!) < new Date())
          throw new ServerError(
            StatusCodes.UNAUTHORIZED,
            'You are not authorized.',
          );
      }),
  }),

  resetPassword: z.object({
    body: z.object({
      password: z.string().min(6, 'Password must be 6 characters long'),
    }),
  }),
};
