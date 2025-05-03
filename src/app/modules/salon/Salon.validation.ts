import { z } from 'zod';
import { EUserGender } from '../user/User.enum';
import { week } from './Salon.constant';

export const SalonValidations = {
  upsert: z.object({
    body: z.object({
      name: z
        .string({ required_error: 'name is missing' })
        .min(1, 'name is missing'),
      banner: z
        .string({ required_error: 'banner is missing' })
        .min(1, 'banner is missing'),
      location: z.object({
        coordinates: z.tuple([
          z.number().min(-180).max(180), // Longitude
          z.number().min(-90).max(90), // Latitude
        ]),
        address: z.string().optional(),
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
      contacts: z.array(z.string()).optional(),
      website: z.string().optional(),
    }),
  }),
};
