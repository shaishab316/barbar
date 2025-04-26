import { z } from 'zod';

export const AuthValidations = {
  login: z.object({
    body: z.object({
      email: z.string().email('Give a valid email'),
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),
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

  resetPassword: z.object({
    body: z.object({
      password: z.string().min(6, 'Password must be 6 characters long'),
    }),
  }),
};
