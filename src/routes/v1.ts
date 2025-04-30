import { Router } from 'express';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import auth from '../app/middlewares/auth';
import { EUserRole } from '../app/modules/user/User.enum';
import { TRoute } from '../types/route.types';
import AdminRoutes from '../app/modules/admin/Admin.route';
import { BannerRoutes } from '../app/modules/banner/Banner.route';
import HostRoutes from '../app/modules/host/Host.route';
import { SalonRoutes } from '../app/modules/salon/Salon.route';
import { ServiceRoutes } from '../app/modules/service/Service.route';

const routes: TRoute[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/profile',
    middlewares: [auth()],
    route: UserRoutes.user,
  },
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
    path: '/banners',
    route: BannerRoutes.user,
  },
  {
    path: '/salons',
    middlewares: [auth()],
    route: SalonRoutes.user,
  },
  {
    path: '/services',
    middlewares: [auth()],
    route: ServiceRoutes.user,
  },
];

export default Router().inject(routes);
