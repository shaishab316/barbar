import { Router } from 'express';
import { ServiceControllers } from './Service.controller';
import { ServiceValidations } from './Service.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import capture from '../../middlewares/capture';
import Service from './Service.model';
import { QueryValidations } from '../query/Query.validation';

/** Host routes */
const host = Router();

host.post(
  '/create',
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 500 }],
  }),
  purifyRequest(ServiceValidations.create),
  ServiceControllers.create,
);

host.patch(
  '/:serviceId/edit',
  purifyRequest(QueryValidations.exists('serviceId', Service)),
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 500 }],
  }),
  purifyRequest(ServiceValidations.edit),
  ServiceControllers.edit,
);

host.delete(
  '/:serviceId/delete',
  purifyRequest(QueryValidations.exists('serviceId', Service)),
  ServiceControllers.delete,
);

/** User routes */
const user = Router();

user.get(
  '/',
  purifyRequest(QueryValidations.list, ServiceValidations.list),
  ServiceControllers.list,
);

user.get(
  '/:serviceId',
  purifyRequest(QueryValidations.exists('serviceId', Service)),
  ServiceControllers.retrieve,
);

export const ServiceRoutes = {
  host,
  user,
};
