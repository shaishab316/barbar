import { z } from 'zod';

export const CategoryValidations = {
  create: z.object({
    body: z.object({
      name: z
        .string({ required_error: 'Name is missing' })
        .min(1, 'Name is missing'),
      banner: z
        .string({ required_error: 'Banner is missing' })
        .min(1, 'Banner is missing'),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      banner: z.string().optional(),
    }),
  }),
};
