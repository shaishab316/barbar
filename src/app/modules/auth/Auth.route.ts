import express from 'express';
import { AuthControllers } from './Auth.controller';
import { AuthValidations } from './Auth.validation';
import auth from '../../middlewares/auth';
import { UserControllers } from '../user/User.controller';
import { UserValidations } from '../user/User.validation';
import imageUploader from '../../middlewares/imageUploader';
import purifyRequest from '../../middlewares/purifyRequest';
import { EUserRole } from '../user/User.enum';

const router = express.Router();

router.post(
  '/register',
  imageUploader({
    width: 300,
    height: 300,
  }),
  purifyRequest(UserValidations.create),
  UserControllers.create,
);

router.patch(
  '/edit',
  auth(EUserRole.USER, EUserRole.ADMIN),
  imageUploader({
    width: 300,
    height: 300,
  }),
  purifyRequest(UserValidations.edit),
  UserControllers.edit,
);

router.post(
  '/login',
  purifyRequest(AuthValidations.login),
  AuthControllers.login,
);

router.post(
  '/login/:provider',
  purifyRequest(AuthValidations.loginWith),
  AuthControllers.loginWith,
);

router.post('/logout', AuthControllers.logout);

router.patch(
  '/change-password',
  auth(EUserRole.USER, EUserRole.ADMIN),
  purifyRequest(AuthValidations.passwordChange),
  AuthControllers.changePassword,
);

router.post(
  '/send-otp',
  purifyRequest(AuthValidations.sendOtp),
  AuthControllers.sendOtp,
);

router.post(
  '/verify-otp',
  purifyRequest(AuthValidations.verifyOtp),
  AuthControllers.verifyOtp,
);

router.post(
  '/reset-password',
  auth(EUserRole.USER, EUserRole.ADMIN),
  purifyRequest(AuthValidations.resetPassword),
  AuthControllers.resetPassword,
);

/**
 * generate new access token
 */
router.get(
  '/refresh-token',
  purifyRequest(AuthValidations.refreshToken),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;
