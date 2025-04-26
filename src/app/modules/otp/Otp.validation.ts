import { z } from 'zod';
import { upper } from '../../../util/transform/upper';

export const OtpValidations = {
  send: z.object({
    body: z.object({
      email: z
        .string({ required_error: 'Email is missing' })
        .email('Give a valid email'),
    }),
  }),

  verify: z.object({
    body: z.object({
      email: z
        .string({ required_error: 'Email is missing' })
        .email('Give a valid email'),
      otp: z.string({ required_error: 'OTP is missing' }).transform(upper),
    }),
  }),
};
