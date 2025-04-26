import { UserServices } from './User.service';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { StatusCodes } from 'http-status-codes';

export const UserControllers = {
  create: catchAsync(async ({ body }, res) => {
    const data = await UserServices.create(body);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'User registered successfully!',
      data,
    });
  }),

  edit: catchAsync(async ({ body, user }, res) => {
    const data = await UserServices.edit({
      ...body,
      oldAvatar: user?.avatar,
      _id: user?._id,
    });

    serveResponse(res, {
      message: 'Profile updated successfully!',
      data,
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
