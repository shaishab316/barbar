import { Router } from 'express';
import { UserControllers } from './User.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { TRoute } from '../../../types/route.types';
import { ProfileRoutes } from '../profile/Profile.route';

const userRoutes: TRoute[] = [
  {
    path: '/profile',
    route: ProfileRoutes,
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
