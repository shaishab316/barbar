import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { SalonRoutes } from '../salon/Salon.route';
import { CategoryRoutes } from '../category/Category.route';
import { ServiceRoutes } from '../service/Service.route';
import { SpecialistRoutes } from '../specialist/Specialist.route';
import { PackageRoutes } from '../package/Package.route';

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
    path: '/specialists',
    route: SpecialistRoutes,
  },
  {
    path: '/services',
    route: ServiceRoutes.host,
  },
  {
    path: '/packages',
    route: PackageRoutes.host,
  },
];

export default Router().inject(routes);
