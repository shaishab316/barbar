import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { NotificationServices } from './Notification.service';

export const NotificationControllers = {
  list: catchAsync(async ({ query }, res) => {
    const data = await NotificationServices.list(query);

    serveResponse(res, {
      message: 'Notifications retrieved successfully!',
      data,
    });
  }),

  read: catchAsync(async ({ params }, res) => {
    const data = await NotificationServices.read(params.notificationId);

    serveResponse(res, {
      message: 'Notification read successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    const data = await NotificationServices.delete(params.notificationId);

    serveResponse(res, {
      message: 'Notification deleted successfully!',
      data,
    });
  }),

  deleteRead: catchAsync(async (_, res) => {
    const data = await NotificationServices.deleteRead();

    serveResponse(res, {
      message: 'Notifications deleted successfully!',
      data,
    });
  }),
};
