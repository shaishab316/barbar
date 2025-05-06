import { Router } from 'express';
import { UserControllers } from './User.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { TRoute } from '../../../types/route.types';
import { ProfileRoutes } from '../profile/Profile.route';
import { AppointmentRoutes } from '../appointment/Appointment.route';
import { ChatRoutes } from '../chat/Chat.route';

const userRoutes: TRoute[] = [
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/appointments',
    route: AppointmentRoutes,
  },
  {
    path: '/chats',
    route: ChatRoutes,
  },
];

export const UserRoutes = {
  admin: Router().get(
    '/',
    purifyRequest(QueryValidations.list),
    UserControllers.list,
  ),
  user: Router().inject(userRoutes),
};
