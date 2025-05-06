import { Router } from 'express';
import { ChatControllers } from './Chat.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import User from '../user/User.model';

const router = Router();

router.post(
  '/:userId',
  purifyRequest(QueryValidations.exists('userId', User)),
  ChatControllers.create,
);

export const ChatRoutes = router;
