import { z } from 'zod';
import { EUserGender } from './User.enum';
import { date } from '../../../util/transform/date';

export const UserValidations = {
  create: z.object({
    body: z.object({
      name: z
        .string({
          required_error: 'Name is missing',
        })
        .min(1, 'Name is missing'),
      email: z
        .string({
          required_error: 'Email is missing',
        })
        .email('Give a valid email'),
      password: z
        .string({
          required_error: 'Password is missing',
        })
        .min(6, 'Password must be at least 6 characters long'),
      avatar: z
        .string({
          required_error: 'Upload an avatar',
        })
        .min(1, 'Upload an avatar'),
      phone: z
        .string({
          required_error: 'Phone number is missing',
        })
        .min(1, 'Phone number is missing'),
      gender: z
        .string({
          required_error: 'Gender is missing',
        })
        .refine(
          val => Object.values(EUserGender).includes(val as EUserGender),
          {
            message: 'Give a valid gender',
          },
        ),
      birthDate: z
        .string({
          required_error: 'Birth date is missing',
        })
        .transform(date),
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
