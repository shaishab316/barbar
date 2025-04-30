import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { UserRoutes } from '../user/User.route';
import { BannerRoutes } from '../banner/Banner.route';
import { CategoryRoutes } from '../category/Category.route';

const routes: TRoute[] = [
  {
    path: '/users',
    route: UserRoutes.admin,
  },
  {
    path: '/banners',
    route: BannerRoutes.admin,
  },
  {
    path: '/categories',
    route: CategoryRoutes.admin,
  },
];

export default Router().inject(routes);
