import { z } from 'zod';
import { EUserGender } from '../user/User.enum';
import { week } from './Salon.constant';

export const SalonValidations = {
  create: z.object({
    body: z.object({
      name: z
        .string({ required_error: 'name is missing' })
        .min(1, 'name is missing'),
      banner: z
        .string({ required_error: 'banner is missing' })
        .min(1, 'banner is missing'),
      location: z.object({
        type: z.literal('Point'),
        coordinates: z.tuple([
          z.number().min(-180).max(180), // Longitude
          z.number().min(-90).max(90), // Latitude
        ]),
      }),
      gender: z.nativeEnum(EUserGender),
      businessHours: z.object(
        Object.fromEntries(
          week.map(day => [
            day,
            z.object({
              start: z
                .string({ required_error: 'start is missing' })
                .min(1, 'start is missing'),
              end: z
                .string({ required_error: 'end is missing' })
                .min(1, 'end is missing'),
              isOpen: z.boolean().default(true),
            }),
          ]),
        ),
      ),
    }),
  }),
};
