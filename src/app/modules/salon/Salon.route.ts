import { Router } from 'express';
import { SalonControllers } from './Salon.controller';
import { SalonValidations } from './Salon.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import capture from '../../middlewares/capture';
import { QueryValidations } from '../query/Query.validation';
import Salon from './Salon.model';
import { ServiceControllers } from '../service/Service.controller';
import { PackageControllers } from '../package/Package.controller';
import { AppointmentValidations } from '../appointment/Appointment.validation';
import { AppointmentControllers } from '../appointment/Appointment.controller';
import { ReviewRoutes } from '../review/Review.route';
import auth from '../../middlewares/auth';
import { SpecialistControllers } from '../specialist/Specialist.controller';
import { ServiceValidations } from '../service/Service.validation';

/** Host routes */
const host = Router();

host.get('/', SalonControllers.salon);

host.patch(
  '/',
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 720, height: 360 }],
  }),
  purifyRequest(SalonValidations.upsert),
  SalonControllers.upsert,
);

host.post(
  '/gallery',
  capture({
    fields: [{ name: 'images', maxCount: 10, width: 720 }],
  }),
  SalonControllers.uploadIntoGallery,
);

host.delete(
  '/gallery/:imageId/delete',
  purifyRequest(QueryValidations.validOid('imageId')),
  SalonControllers.deleteFromGallery,
);

/** User routes */
const user = Router();

user.get(
  '/',
  purifyRequest(QueryValidations.list, SalonValidations.list),
  SalonControllers.list,
);

user.get(
  '/:salonId',
  purifyRequest(QueryValidations.exists('salonId', Salon)),
  SalonControllers.retrieve,
);

/** Gallery Routes */
user.get(
  '/:salonId/gallery',
  purifyRequest(QueryValidations.exists('salonId', Salon)),
  SalonControllers.gallery,
);

/** Specialist Routes */
user.get(
  '/:salonId/specialists',
  purifyRequest(QueryValidations.exists('salonId', Salon)),
  SpecialistControllers.retrieve,
);

/** Service Routes */

user.get(
  '/:salonId/categories',
  purifyRequest(QueryValidations.exists('salonId', Salon)),
  ServiceControllers.categories,
);

user.get(
  '/:salonId/services',
  purifyRequest(
    QueryValidations.exists('salonId', Salon),
    ServiceValidations.list,
  ),
  ServiceControllers.list,
);

/** Package Routes */
user.get(
  '/:salonId/packages',
  purifyRequest(
    QueryValidations.exists('salonId', Salon),
    QueryValidations.list,
  ),
  PackageControllers.list,
);

/** Appointment Routes */
user.post(
  '/:salonId/appointments/create',
  auth(),
  purifyRequest(
    QueryValidations.exists('salonId', Salon),
    AppointmentValidations.create,
  ),
  AppointmentControllers.create,
);

/** Review Routes */
user.use('/', auth(), ReviewRoutes.salon);

export const SalonRoutes = {
  host,
  user,
};
