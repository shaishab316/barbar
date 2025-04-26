import express from 'express';
import { AuthControllers } from './Auth.controller';
import { AuthValidations } from './Auth.validation';
import auth from '../../middlewares/auth';
import { UserControllers } from '../user/User.controller';
import { UserValidations } from '../user/User.validation';
import capture from '../../middlewares/capture';
import purifyRequest from '../../middlewares/purifyRequest';
import { EUserRole } from '../user/User.enum';
import { otpLimiter } from '../otp/Otp.utils';
import { OtpValidations } from '../otp/Otp.validation';
import { OtpControllers } from '../otp/Otp.controller';
import { temUser } from '../../middlewares/temUser';

const router = express.Router();

router.post(
  '/register',
  capture({
    fields: [{ name: 'avatar', maxCount: 1, width: 300 }],
  }),
  purifyRequest(UserValidations.create),
  UserControllers.create,
);

router.post(
  '/login',
  purifyRequest(AuthValidations.login),
  temUser('+password'),
  AuthControllers.login,
);

router.post('/logout', AuthControllers.logout);

router.post(
  '/send-otp',
  otpLimiter,
  purifyRequest(OtpValidations.send),
  OtpControllers.send,
);

router.post(
  '/verify-otp',
  purifyRequest(OtpValidations.verify),
  temUser(),
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
