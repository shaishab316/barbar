import { Router } from 'express';
import { MessageControllers } from './Message.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';

const router = Router();

router.get('/', purifyRequest(QueryValidations.list), MessageControllers.list);

export const MessageRoutes = router;
