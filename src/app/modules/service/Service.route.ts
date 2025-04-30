import { Router } from 'express';
import { ServiceControllers } from './Service.controller';
import { ServiceValidations } from './Service.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import capture from '../../middlewares/capture';

const router = Router();

router.post(
  '/create',
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 500 }],
  }),
  purifyRequest(ServiceValidations.create),
  ServiceControllers.create,
);

export const ServiceRoutes = router;
