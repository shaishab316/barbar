import { z } from 'zod';
import Service from '../service/Service.model';
import { exists } from '../../../util/db/exists';
import { oid } from '../../../util/transform/oid';

export const PackageValidations = {
  create: z.object({
    body: z.object({
      name: z
        .string({ required_error: 'name is missing' })
        .min(1, 'name is missing'),
      banner: z
        .string({ required_error: 'banner is missing' })
        .min(1, 'banner is missing'),
      description: z
        .string({
          required_error: 'description is missing',
        })
        .min(1, 'description is missing'),
      services: z
        .array(z.string().transform(oid).refine(exists(Service)))
        .min(1, 'services is missing'),
      note: z.string().optional(),
      price: z
        .number({ required_error: 'price is missing' })
        .min(1, 'price is missing'),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      banner: z.string().optional(),
      description: z.string().optional(),
      services: z
        .array(z.string().transform(oid).refine(exists(Service)))
        .optional(),
      note: z.string().optional(),
      price: z.number().optional(),
    }),
  }),
};
