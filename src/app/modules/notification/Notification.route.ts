import { Router } from 'express';
import { NotificationControllers } from './Notification.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Notification from './Notification.model';

const router = Router();

router.get(
  '/',
  purifyRequest(QueryValidations.list),
  NotificationControllers.list,
);

router.get(
  '/:notificationId/read',
  purifyRequest(QueryValidations.exists('notificationId', Notification)),
  NotificationControllers.read,
);

router.delete(
  '/:notificationId/delete',
  purifyRequest(QueryValidations.exists('notificationId', Notification)),
  NotificationControllers.delete,
);

router.delete('/delete-read', NotificationControllers.deleteRead);

export const NotificationRoutes = router;
