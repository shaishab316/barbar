import { z } from 'zod';

export const ReviewValidations = {
  store: z.object({
    body: z.object({
      rating: z.coerce
        .number({
          required_error: 'Rating is missing',
        })
        .min(1, 'Rating must be between 1 to 5')
        .max(5, 'Rating must be between 1 to 5'),
      comment: z
        .string({
          required_error: 'Comment is missing',
        })
        .min(1, 'Comment is missing'),
    }),
  }),
};
