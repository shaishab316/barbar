import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { SalonServices } from './Salon.service';

export const SalonControllers = {
  create: catchAsync(async ({ body, user }, res) => {
    body.host = user?._id;

    const data = await SalonServices.create(body);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Salon created successfully!',
      data,
    });
  }),
};
