import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { UserRoutes } from '../user/User.route';

const routes: TRoute[] = [
  {
    path: '/users',
    route: UserRoutes.admin,
  }
];

export default Router().inject(routes);
