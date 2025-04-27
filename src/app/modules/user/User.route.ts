import { Router } from 'express';
import { UserControllers } from './User.controller';
import capture from '../../middlewares/capture';
import purifyRequest from '../../middlewares/purifyRequest';
import { UserValidations } from './User.validation';
import { QueryValidations } from '../query/Query.validation';
import serveResponse from '../../../util/server/serveResponse';
import { userExcludeFields } from './User.constant';
import auth from '../../middlewares/auth';

const user = Router();

user.get('/', auth(), ({ user }: any, res) => {
  userExcludeFields.forEach(field => (user[field] = undefined));

  serveResponse(res, {
    message: 'Profile fetched successfully!',
    data: user,
  });
});

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
  auth(),
  purifyRequest(UserValidations.cngPass),
  UserControllers.changePassword,
);

export const UserRoutes = {
  admin: Router().get(
    '/',
    purifyRequest(QueryValidations.list),
    UserControllers.list,
  ),
  user,
};
