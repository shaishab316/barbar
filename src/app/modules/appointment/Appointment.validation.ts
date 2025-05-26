import { z } from 'zod';
import { EAppointmentState } from './Appointment.enum';
import { oid } from '../../../util/transform/oid';
import { exists } from '../../../util/db/exists';
import Specialist from '../specialist/Specialist.model';
import { date } from '../../../util/transform/date';
import Service from '../service/Service.model';
import { lower } from '../../../util/transform/lower';
import { EUserRole } from '../user/User.enum';

export const AppointmentValidations = {
  create: z.object({
    body: z.object({
      specialist: z.string().transform(oid).refine(exists(Specialist)),
      date: z.string().transform(date),
      services: z
        .array(z.string().transform(oid).refine(exists(Service)))
        .min(1, 'Services is missing'),
    }),
  }),

  changeState: z.object({
    params: z.object({
      state: z.string().transform(lower).pipe(z.nativeEnum(EAppointmentState)),
    }),
  }),

  list: z.object({
    query: z.object({
      state: z
        .string()
        .transform(lower)
        .pipe(z.nativeEnum(EAppointmentState))
        .optional(),
      search: z.string().trim().optional(),
    }),
  }),

  receipt: z.object({
    query: z.object({
      role: z
        .string()
        .transform(lower)
        .default(EUserRole.USER)
        .pipe(z.nativeEnum(EUserRole)),
    }),
  }),
};
