import { z } from 'zod';

export const BannerValidations = {
  create: z.object({
    body: z.object({
      image: z.string().min(1, 'Image is required'),
    }),
  }),
};
