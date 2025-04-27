import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { OtpValidations } from './Otp.validation';
import { otpLimiter } from './Otp.utils';
import { OtpControllers } from './Otp.controller';
import { temUser } from '../../middlewares/temUser';

const router = Router();

router.post(
  '/send',
  otpLimiter,
  purifyRequest(OtpValidations.send),
  OtpControllers.send,
);

router.post(
  '/verify',
  purifyRequest(OtpValidations.verify),
  temUser(),
  OtpControllers.verify,
);

export const OtpRoutes = router;
