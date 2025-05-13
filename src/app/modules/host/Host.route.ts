import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { SalonRoutes } from '../salon/Salon.route';
import { ServiceRoutes } from '../service/Service.route';
import { SpecialistRoutes } from '../specialist/Specialist.route';
import { PackageRoutes } from '../package/Package.route';
import { AppointmentRoutes } from '../appointment/Appointment.route';

const routes: TRoute[] = [
  {
    path: '/salon',
    route: SalonRoutes.host,
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
  {
    path: '/appointments',
    route: AppointmentRoutes.host,
  },
];

export default Router().inject(routes);
