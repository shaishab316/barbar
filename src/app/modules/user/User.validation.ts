import { z } from 'zod';

export const UserValidations = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email format'),
      password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters long'),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      email: z.string().email('Invalid email format').optional(),
      images: z.array(z.string()).optional(),
    }),
  }),
};
