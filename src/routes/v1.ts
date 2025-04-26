import { Router } from 'express';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import auth from '../app/middlewares/auth';
import { EUserRole } from '../app/modules/user/User.enum';
import { TRoute } from '../types/route.types';
import AdminRoutes from '../app/modules/admin/Admin.routes';
import serveResponse from '../util/server/serveResponse';
import { BannerRoutes } from '../app/modules/banner/Banner.route';

const routes: TRoute[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/profile',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: UserRoutes.user,
  },
  {
    path: '/admin',
    middlewares: [auth(EUserRole.ADMIN)],
    route: AdminRoutes,
  },
  {
    path: '/me',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: Router().get('/', ({ user }, res) => {
      serveResponse(res, {
        message: 'Profile fetched successfully!',
        data: user,
      });
    }),
  },
  {
    path: '/banners',
    route: BannerRoutes.user,
  },
];

export default Router().inject(routes);
