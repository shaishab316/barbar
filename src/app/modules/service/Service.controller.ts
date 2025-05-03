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

  edit: catchAsync(async ({ body, params }, res) => {
    const data = await ServiceServices.edit(params.serviceId, body);

    serveResponse(res, {
      message: 'Service updated successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    await ServiceServices.delete(params.serviceId);

    serveResponse(res, {
      message: 'Service deleted successfully!',
    });
  }),

  list: catchAsync(async ({ query, params }, res) => {
    const { services, meta } = await ServiceServices.list({
      ...query,
      salon: params.salonId,
    });

    serveResponse(res, {
      message: 'Services retrieved successfully!',
      meta,
      data: services,
    });
  }),

  retrieve: catchAsync(async ({ params }, res) => {
    const data = await ServiceServices.retrieve(params.serviceId);

    serveResponse(res, {
      message: 'Service retrieved successfully!',
      data,
    });
  }),
};
