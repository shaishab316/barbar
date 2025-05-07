import { Router } from 'express';
import { ChatControllers } from './Chat.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import User from '../user/User.model';
import Chat from './Chat.model';

const router = Router();

router.get('/', purifyRequest(QueryValidations.list), ChatControllers.list);

router.post(
  '/:userId',
  purifyRequest(QueryValidations.exists('userId', User)),
  ChatControllers.create,
);

router.delete(
  '/:chatId/delete',
  purifyRequest(QueryValidations.exists('chatId', Chat)),
  ChatControllers.delete,
);

export const ChatRoutes = router;
