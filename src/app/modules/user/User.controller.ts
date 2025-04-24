import { UserServices } from './User.service';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';

export const UserControllers = {
  create: catchAsync(async ({ body }, res) => {
    body.avatar = body.images[0];

    await UserServices.create(body);

    serveResponse(res, {
      message: 'Send Otp successfully! Check your email.',
    });
  }),

  edit: catchAsync(async (req, res) => {
    req.body.avatar = req.body.images?.[0];

    const updatedUser = await UserServices.edit(req);

    serveResponse(res, {
      message: 'Profile updated successfully!',
      data: updatedUser,
    });
  }),

  list: catchAsync(async (req, res) => {
    const { meta, users } = await UserServices.list(req.query);

    serveResponse(res, {
      message: 'Users retrieved successfully!',
      meta,
      data: users,
    });
  }),
};
