import { Router } from 'express';
import { PackageControllers } from './Package.controller';
import { PackageValidations } from './Package.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import capture from '../../middlewares/capture';
import { QueryValidations } from '../query/Query.validation';
import Package from './Package.model';

/** Host routes */
const host = Router();

host.post(
  '/create',
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 650, height: 512 }],
  }),
  purifyRequest(PackageValidations.create),
  PackageControllers.create,
);

host.patch(
  '/:packageId/edit',
  purifyRequest(QueryValidations.exists('packageId', Package)),
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 650, height: 512 }],
  }),
  purifyRequest(PackageValidations.edit),
  PackageControllers.edit,
);

host.delete(
  '/:packageId/delete',
  purifyRequest(QueryValidations.exists('packageId', Package)),
  PackageControllers.delete,
);

/** User routes */
const user = Router();

user.get('/', purifyRequest(QueryValidations.list), PackageControllers.list);

user.get(
  '/:packageId',
  purifyRequest(QueryValidations.exists('packageId', Package)),
  PackageControllers.retrieve,
);

export const PackageRoutes = {
  host,
  user,
};
