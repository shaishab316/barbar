import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { BannerRoutes } from '../banner/Banner.route';
import { AuthRoutes } from '../auth/Auth.route';
import { SalonRoutes } from '../salon/Salon.route';
import { ServiceRoutes } from '../service/Service.route';
import { PackageRoutes } from '../package/Package.route';

const routes: TRoute[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/banners',
    route: BannerRoutes.user,
  },
  {
    path: '/salons',
    route: SalonRoutes.user,
  },
  {
    path: '/services',
    route: ServiceRoutes.user,
  },
  {
    path: '/packages',
    route: PackageRoutes.user,
  },
];

export default Router().inject(routes);
