import { z } from 'zod';
import { EUserGender } from '../user/User.enum';
import { oid } from '../../../util/transform/oid';
import { exists } from '../../../util/db/exists';
import Category from '../category/Category.model';
import ms from 'ms';

export const ServiceValidations = {
  create: z.object({
    body: z.object({
      name: z
        .string({ required_error: 'Name is missing' })
        .min(1, 'Name is missing'),
      banner: z
        .string({ required_error: 'Banner is missing' })
        .min(1, 'Banner is missing'),
      category: z
        .string({ required_error: 'Category is missing' })
        .transform(oid)
        .refine(exists(Category)),
      price: z.coerce
        .number({ required_error: 'Price is missing' })
        .min(1, "Price can't be zero"),
      duration: z.coerce
        .number({
          required_error: 'Duration is missing',
        })
        .min(ms('1m'), 'Duration must be at least 1 minute'),
      gender: z.nativeEnum(EUserGender),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      banner: z.string().optional(),
      category: z.string().optional(),
      price: z.coerce.number().optional(),
      duration: z.coerce
        .number()
        .min(ms('1m'), 'Duration must be at least 1 minute')
        .optional(),
      gender: z.nativeEnum(EUserGender).optional(),
    }),
  }),
};
