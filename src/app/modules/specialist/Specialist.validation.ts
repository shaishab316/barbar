import { z } from 'zod';

export const SpecialistValidations = {
  create: z.object({
    body: z.object({
      avatar: z
        .string({ required_error: 'Avatar is missing' })
        .min(1, 'Avatar is missing'),
      name: z
        .string({ required_error: 'Name is missing' })
        .min(1, 'Name is missing'),
      role: z
        .string({ required_error: 'Role is missing' })
        .min(1, 'Role is missing'),
    }),
  }),

  edit: z.object({
    body: z.object({
      avatar: z.string().optional(),
      name: z.string().optional(),
      role: z.string().optional(),
    }),
  }),
};
