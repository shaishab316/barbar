import { z } from 'zod';
import { EUserGender } from './User.enum';
import { date } from '../../../util/transform/date';

export const UserValidations = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is missing'),
      email: z.string().email('Give a valid email'),
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),
      avatar: z.string().min(1, 'Upload an avatar'),
      phone: z.string().min(1, 'Phone number is missing'),
      gender: z
        .string()
        .refine(
          val => Object.values(EUserGender).includes(val as EUserGender),
          {
            message: 'Give a valid gender',
          },
        ),
      birthDate: z.string().transform(date),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      email: z.string().email('Give a valid email').optional(),
      avatar: z.string().optional(),
      phone: z.string().optional(),
      gender: z
        .string()
        .refine(
          val => Object.values(EUserGender).includes(val as EUserGender),
          {
            message: 'Give a valid gender',
          },
        )
        .optional(),
      birthDate: z.string().transform(date).optional(),
    }),
  }),
};
