import { z } from 'zod';

export const ReviewValidations = {
  store: z.object({
    body: z.object({
      rating: z.coerce
        .number()
        .min(1, 'Rating must be between 1 to 5')
        .max(5, 'Rating must be between 1 to 5')
        .optional(),
      comment: z.string().optional(),
    }),
  }),
};
