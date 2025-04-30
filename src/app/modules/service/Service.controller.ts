import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { ServiceServices } from './Service.service';
import ms from 'ms';

export const ServiceControllers = {
  create: catchAsync(async ({ body, user }, res) => {
    const data = (await ServiceServices.create(body, user!._id!)).toJSON();

    data.duration = ms(data.duration, { long: true }) as any;

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Service created successfully!',
      data,
    });
  }),
};
