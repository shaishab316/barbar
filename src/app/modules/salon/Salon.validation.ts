import { z } from 'zod';
import { EUserGender } from '../user/User.enum';
import { week } from './Salon.constant';
import { json } from '../../../util/transform/json';

export const SalonValidations = {
  upsert: z.object({
    body: z.object({
      name: z.string().optional(),
      banner: z.string().optional(),
      location: z
        .object({
          coordinates: z.tuple([
            z
              .number()
              .min(-180, { message: 'Longitude must be ≥ -180' })
              .max(180, { message: 'Longitude must be ≤ 180' }),
            z
              .number()
              .min(-90, { message: 'Latitude must be ≥ -90' })
              .max(90, { message: 'Latitude must be ≤ 90' }),
          ]),
          address: z.string().optional(),
        })
        .optional(),
      gender: z.nativeEnum(EUserGender).optional(),
      businessHours: z
        .string()
        .transform(json)
        .pipe(
          z.object(
            Object.fromEntries(
              week.map(day => [
                day,
                z
                  .object({
                    start: z
                      .string({ required_error: 'start is missing' })
                      .min(1, 'start is missing'),
                    end: z
                      .string({ required_error: 'end is missing' })
                      .min(1, 'end is missing'),
                    isOpen: z.boolean().default(true),
                  })
                  .optional(),
              ]),
            ),
          ),
        )
        .optional(),
      contacts: z.array(z.string()).optional(),
      website: z.string().optional(),
    }),
  }),
};
