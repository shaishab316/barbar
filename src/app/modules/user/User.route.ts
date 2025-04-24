import { Router } from 'express';
import { UserControllers } from './User.controller';
import imageUploader from '../../middlewares/imageUploader';
import purifyRequest from '../../middlewares/purifyRequest';
import { UserValidations } from './User.validation';
import { QueryValidations } from '../query/Query.validation';

export const UserRoutes = {
  admin: Router().get(
    '/',
    purifyRequest(QueryValidations.list),
    UserControllers.list,
  ),
  user: Router().patch(
    '/edit',
    imageUploader({
      width: 300,
      height: 300,
    }),
    purifyRequest(UserValidations.edit),
    UserControllers.edit,
  ),
};
