import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { ChatServices } from './Chat.service';

export const ChatControllers = {
  create: catchAsync(async ({ user, params }, res) => {
    const data = await ChatServices.create([user!._id!, params.userId]);

    serveResponse(res, {
      message: 'Chat resolved successfully!',
      data,
    });
  }),
};
