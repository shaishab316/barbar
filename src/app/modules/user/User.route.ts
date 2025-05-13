import { Router } from 'express';
import { UserControllers } from './User.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { TRoute } from '../../../types/route.types';
import { ProfileRoutes } from '../profile/Profile.route';
import { AppointmentRoutes } from '../appointment/Appointment.route';
import { ChatRoutes } from '../chat/Chat.route';
import { UserValidations } from './User.validation';

const userRoutes: TRoute[] = [
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/appointments',
    route: AppointmentRoutes.user,
  },
  {
    path: '/chats',
    route: ChatRoutes,
  },
];

export const UserRoutes = {
  admin: Router().get(
    '/',
    purifyRequest(QueryValidations.list, UserValidations.list),
    UserControllers.list,
  ),
  user: Router().inject(userRoutes),
};
