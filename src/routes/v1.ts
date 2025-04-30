import { Router } from 'express';
import auth from '../app/middlewares/auth';
import { EUserRole } from '../app/modules/user/User.enum';
import { TRoute } from '../types/route.types';
import AdminRoutes from '../app/modules/admin/Admin.route';
import HostRoutes from '../app/modules/host/Host.route';
import { UserRoutes } from '../app/modules/user/User.route';
import PublicRoutes from '../app/modules/public/Public.route';

const routes: TRoute[] = [
  {
    path: '/admin',
    middlewares: [auth([EUserRole.ADMIN])],
    route: AdminRoutes,
  },
  {
    path: '/host',
    middlewares: [auth([EUserRole.HOST])],
    route: HostRoutes,
  },
  {
    path: '/',
    middlewares: [auth()],
    route: UserRoutes.user,
  },
  {
    path: '/',
    route: PublicRoutes,
  },
];

export default Router().inject(routes);
