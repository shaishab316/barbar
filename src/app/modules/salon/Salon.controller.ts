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

  list: catchAsync(async ({ query }, res) => {
    const { meta, salons } = await SalonServices.list(query);

    serveResponse(res, {
      message: 'Salons retrieved successfully!',
      meta,
      data: salons,
    });
  }),

  uploadIntoGallery: catchAsync(async ({ body, user }, res) => {
    await SalonServices.uploadIntoGallery(user!._id!, body.images);

    serveResponse(res, {
      message: 'Gallery uploaded successfully!',
    });
  }),

  deleteFromGallery: catchAsync(async ({ params, query }, res) => {
    await SalonServices.deleteFromGallery(params.salonId, query.imageId);

    serveResponse(res, {
      message: 'Gallery deleted successfully!',
    });
  }),
};
