import { Router } from 'express';
import { ServiceControllers } from './Service.controller';
import { ServiceValidations } from './Service.validation';
import purifyRequest from '../../middlewares/purifyRequest';

const router = Router();

export const ServiceRoutes = router;
