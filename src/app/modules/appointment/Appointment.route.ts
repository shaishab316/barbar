import { Router } from 'express';
import { AppointmentControllers } from './Appointment.controller';
import { AppointmentValidations } from './Appointment.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Appointment from './Appointment.model';

const router = Router();

router.get(
  '/my-appointments',
  purifyRequest(QueryValidations.list),
  AppointmentControllers.myAppointments,
);

router.post(
  '/:appointmentId/:state',
  purifyRequest(
    QueryValidations.exists('appointmentId', Appointment),
    AppointmentValidations.changeState,
  ),
  AppointmentControllers.changeState,
);

export const AppointmentRoutes = router;
