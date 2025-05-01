import { Router } from 'express';
import { SpecialistControllers } from './Specialist.controller';
import { SpecialistValidations } from './Specialist.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import capture from '../../middlewares/capture';
import { QueryValidations } from '../query/Query.validation';
import Specialist from './Specialist.model';

const router = Router();

router.get(
  '/',
  purifyRequest(QueryValidations.list),
  SpecialistControllers.list,
);

router.post(
  '/create',
  capture({
    fields: [{ name: 'avatar', maxCount: 1, width: 500 }],
  }),
  purifyRequest(SpecialistValidations.create),
  SpecialistControllers.create,
);

router.patch(
  '/:specialistId/edit',
  purifyRequest(QueryValidations.exists('specialistId', Specialist)),
  capture({
    fields: [{ name: 'avatar', maxCount: 1, width: 500 }],
  }),
  purifyRequest(SpecialistValidations.edit),
  SpecialistControllers.edit,
);

router.delete(
  '/:specialistId/delete',
  purifyRequest(QueryValidations.exists('specialistId', Specialist)),
  SpecialistControllers.delete,
);

export const SpecialistRoutes = router;
