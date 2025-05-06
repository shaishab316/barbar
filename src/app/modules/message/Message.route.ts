import { Router } from 'express';
import { MessageControllers } from './Message.controller';
import { MessageValidations } from './Message.validation';
import purifyRequest from '../../middlewares/purifyRequest';

const router = Router();

export const MessageRoutes = router;
