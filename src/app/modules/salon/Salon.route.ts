import { Router } from 'express';
import { SalonControllers } from './Salon.controller';
import { SalonValidations } from './Salon.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import capture from '../../middlewares/capture';
import { QueryValidations } from '../query/Query.validation';
import Salon from './Salon.model';

/** Host routes */
const host = Router();

host.get('/', SalonControllers.salon);

host.patch(
  '/',
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 720, height: 360 }],
  }),
  purifyRequest(SalonValidations.create),
  SalonControllers.create,
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

user.get('/', purifyRequest(QueryValidations.list), SalonControllers.list);

user.get(
  '/:salonId',
  purifyRequest(QueryValidations.exists('salonId', Salon)),
  SalonControllers.retrieve,
);

export const SalonRoutes = {
  host,
  user,
};
