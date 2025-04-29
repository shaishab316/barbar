import { Router } from 'express';
import { SalonControllers } from './Salon.controller';
import { SalonValidations } from './Salon.validation';
import purifyRequest from '../../middlewares/purifyRequest';

const router = Router();

router.post(
  '/create',
  purifyRequest(SalonValidations.create),
  SalonControllers.create,
);

export const SalonRoutes = router;
