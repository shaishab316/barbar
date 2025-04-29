import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { SalonRoutes } from '../salon/Salon.route';

const routes: TRoute[] = [
  {
    path: '/salon',
    route: SalonRoutes.host,
  },
];

export default Router().inject(routes);
