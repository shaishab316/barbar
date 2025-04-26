import { Router } from 'express';
import { UserControllers } from './User.controller';
import capture from '../../middlewares/capture';
import purifyRequest from '../../middlewares/purifyRequest';
import { UserValidations } from './User.validation';
import { QueryValidations } from '../query/Query.validation';
import serveResponse from '../../../util/server/serveResponse';
import { userExcludeFields } from './User.constant';
import auth from '../../middlewares/auth';
import { EUserRole } from './User.enum';
import { AuthValidations } from '../auth/Auth.validation';
import { AuthControllers } from '../auth/Auth.controller';

const user = Router();

user.get(
  '/',
  auth(EUserRole.USER, EUserRole.HOST, EUserRole.ADMIN),
  ({ user }: any, res) => {
    userExcludeFields.forEach(field => (user[field] = undefined));

    serveResponse(res, {
      message: 'Profile fetched successfully!',
      data: user,
    });
  },
);

user.patch(
  '/edit',
  capture({
    fields: [{ name: 'avatar', maxCount: 1, width: 300 }],
  }),
  purifyRequest(UserValidations.edit),
  UserControllers.edit,
);

user.patch(
  '/change-password',
  auth(EUserRole.USER, EUserRole.ADMIN),
  purifyRequest(AuthValidations.cngPass),
  AuthControllers.cngPass,
);

export const UserRoutes = {
  admin: Router().get(
    '/',
    purifyRequest(QueryValidations.list),
    UserControllers.list,
  ),
  user,
};
