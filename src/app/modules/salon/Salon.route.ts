import { Router } from 'express';
import { SalonControllers } from './Salon.controller';
import { SalonValidations } from './Salon.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import capture from '../../middlewares/capture';

const router = Router();

router.patch(
  '/',
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 720, height: 360 }],
  }),
  purifyRequest(SalonValidations.create),
  SalonControllers.create,
);

export const SalonRoutes = router;
