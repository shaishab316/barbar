import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { ServiceServices } from './Service.service';
import ms from 'ms';
import { SalonServices } from '../salon/Salon.service';

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

  edit: catchAsync(async ({ body, params, user }, res) => {
    const data = await ServiceServices.edit(params.serviceId, body, user!);

    serveResponse(res, {
      message: 'Service updated successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params, user }, res) => {
    await ServiceServices.delete(params.serviceId, user!);

    serveResponse(res, {
      message: 'Service deleted successfully!',
    });
  }),

  categories: catchAsync(async ({ params }, res) => {
    const categories = await ServiceServices.categories(params.salonId);

    serveResponse(res, {
      message: 'Categories retrieved successfully!',
      data: categories,
    });
  }),

  categoriesForHost: catchAsync(async ({ user }, res) => {
    const salon = await SalonServices.salon(user!._id!);

    const categories = await ServiceServices.categories(salon._id);

    serveResponse(res, {
      message: 'Categories retrieved successfully!',
      data: categories,
    });
  }),

  list: catchAsync(async ({ query, params }, res) => {
    const services = await ServiceServices.list({
      ...query,
      salon: params.salonId,
    });

    services.map(service => {
      service.duration = ms(service.duration, { long: true }) as any;
    });

    serveResponse(res, {
      message: 'Services retrieved successfully!',
      meta: {
        query,
      },
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
