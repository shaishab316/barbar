import { Router } from 'express';
import { AppointmentControllers } from './Appointment.controller';
import { AppointmentValidations } from './Appointment.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Appointment from './Appointment.model';

/** User Routes */
const user = Router();

user.get(
  '/my-appointments',
  purifyRequest(QueryValidations.list, AppointmentValidations.list),
  AppointmentControllers.listForUser,
);

user.post(
  '/:appointmentId/:state',
  purifyRequest(
    QueryValidations.exists('appointmentId', Appointment),
    AppointmentValidations.changeState,
  ),
  AppointmentControllers.changeState,
);

/** Admin Routes */
const admin = Router();

admin.get(
  '/',
  purifyRequest(QueryValidations.list, AppointmentValidations.list),
  AppointmentControllers.listForAdmin,
);

/** Host Routes */
const host = Router();

host.get(
  '/',
  purifyRequest(QueryValidations.list, AppointmentValidations.list),
  AppointmentControllers.listForHost,
);

export const AppointmentRoutes = {
  user,
  admin,
  host,
};
