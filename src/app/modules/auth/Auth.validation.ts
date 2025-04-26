import { z } from 'zod';

export const AuthValidations = {
  login: z.object({
    body: z.object({
      email: z
        .string({
          required_error: 'Email is missing',
        })
        .email('Give a valid email'),
      password: z
        .string({
          required_error: 'Password is missing',
        })
        .min(6, 'Password must be at least 6 characters long'),
    }),
  }),

  cngPass: z.object({
    body: z.object({
      oldPassword: z
        .string({
          required_error: 'Old Password is missing',
        })
        .min(1, 'Old Password is required')
        .min(6, 'Old Password must be at least 6 characters long'),
      newPassword: z
        .string({
          required_error: 'New Password is missing',
        })
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

  resetPassword: z.object({
    body: z.object({
      password: z
        .string({ required_error: 'Password is missing' })
        .min(6, 'Password must be 6 characters long'),
    }),
  }),
};
