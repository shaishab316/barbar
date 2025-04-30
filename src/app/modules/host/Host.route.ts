import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { SalonRoutes } from '../salon/Salon.route';
import { CategoryRoutes } from '../category/Category.route';
import { ServiceRoutes } from '../service/Service.route';

const routes: TRoute[] = [
  {
    path: '/salon',
    route: SalonRoutes.host,
  },
  {
    path: '/categories',
    route: CategoryRoutes.host,
  },
  {
    path: '/services',
    route: ServiceRoutes,
  },
];

export default Router().inject(routes);
