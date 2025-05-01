import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { SalonRoutes } from '../salon/Salon.route';
import { CategoryRoutes } from '../category/Category.route';
import { ServiceRoutes } from '../service/Service.route';
import { SpecialistRoutes } from '../specialist/Specialist.route';

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
    route: ServiceRoutes.host,
  },
  {
    path: '/specialists',
    route: SpecialistRoutes,
  },
];

export default Router().inject(routes);
