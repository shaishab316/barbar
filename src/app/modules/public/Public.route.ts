import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { BannerRoutes } from '../banner/Banner.route';
import { AuthRoutes } from '../auth/Auth.route';
import { SalonRoutes } from '../salon/Salon.route';
import { ServiceRoutes } from '../service/Service.route';
import { PackageRoutes } from '../package/Package.route';
import { CategoryRoutes } from '../category/Category.route';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { AppointmentValidations } from '../appointment/Appointment.validation';
import { AppointmentControllers } from '../appointment/Appointment.controller';
import Appointment from '../appointment/Appointment.model';

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
  {
    path: '/categories',
    route: CategoryRoutes.user,
  },
  {
    path: '/',
    route: Router().get(
      '/appointments/:appointmentId/receipt',
      purifyRequest(
        QueryValidations.exists('appointmentId', Appointment),
        AppointmentValidations.receipt,
      ),
      AppointmentControllers.receipt,
    ),
  },
];

export default Router().inject(routes);
