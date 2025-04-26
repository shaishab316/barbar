import { z } from 'zod';
import { upper } from '../../../util/transform/upper';

export const OtpValidations = {
  send: z.object({
    body: z.object({
      email: z.string().email('Give a valid email'),
    }),
  }),

  verify: z.object({
    body: z.object({
      email: z.string().email('Give a valid email'),
      otp: z.string().transform(upper),
    }),
  }),
};
