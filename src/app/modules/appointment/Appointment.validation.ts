import { z } from 'zod';
import { EAppointmentState, EAppointmentType } from './Appointment.enum';
import { oid } from '../../../util/transform/oid';
import { exists } from '../../../util/db/exists';
import Specialist from '../specialist/Specialist.model';
import { date } from '../../../util/transform/date';
import Service from '../service/Service.model';
import Package from '../package/Package.model';
import { lower } from '../../../util/transform/lower';

export const AppointmentValidations = {
  create: z.object({
    body: z.object({
      specialist: z.string().transform(oid).refine(exists(Specialist)),
      date: z.string().transform(date),
      type: z.string().transform(lower).pipe(z.nativeEnum(EAppointmentType)),
      services: z
        .array(z.string().transform(oid).refine(exists(Service)))
        .optional(),
      package: z.string().transform(oid).refine(exists(Package)).optional(),
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
    }),
  }),
};
