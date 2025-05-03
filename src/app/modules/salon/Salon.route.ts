import { Router } from 'express';
import { SalonControllers } from './Salon.controller';
import { SalonValidations } from './Salon.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import capture from '../../middlewares/capture';
import { QueryValidations } from '../query/Query.validation';
import Salon from './Salon.model';
import { ServiceRoutes } from '../service/Service.route';
import { PackageRoutes } from '../package/Package.route';

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

/** Salon routes */
const salon = Router();

salon.get('/', SalonControllers.retrieve);
salon.use('/services', ServiceRoutes.user);
salon.use('/packages', PackageRoutes.user);

/** User routes */
const user = Router();

user.get('/', purifyRequest(QueryValidations.list), SalonControllers.list);

user.use(
  '/:salonId',
  purifyRequest(QueryValidations.exists('salonId', Salon)),
  salon,
);

export const SalonRoutes = {
  host,
  user,
};
