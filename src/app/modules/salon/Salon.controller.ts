import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { SalonServices } from './Salon.service';
import { UserServices } from '../user/User.service';

export const SalonControllers = {
  upsert: catchAsync(async ({ body, user }, res) => {
    body.host = user?._id;

    const data = await SalonServices.upsert(body);
    await UserServices.edit({
      _id: user?._id,
      name: body.name,
    } as any);

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

  retrieve: catchAsync(async ({ params }, res) => {
    const data = await SalonServices.retrieve(params.salonId);

    serveResponse(res, {
      message: 'Salon retrieved successfully!',
      data,
    });
  }),

  uploadIntoGallery: catchAsync(async ({ body, user }, res) => {
    await SalonServices.uploadIntoGallery(user!._id!, body.images);

    serveResponse(res, {
      message: 'Gallery uploaded successfully!',
    });
  }),

  deleteFromGallery: catchAsync(async ({ params, user }, res) => {
    await SalonServices.deleteFromGallery(user!._id!, params.imageId);

    serveResponse(res, {
      message: 'Gallery deleted successfully!',
    });
  }),

  salon: catchAsync(async ({ user }, res) => {
    const data = await SalonServices.salon(user!._id!);

    serveResponse(res, {
      message: 'My Salon retrieved successfully!',
      data,
    });
  }),

  gallery: catchAsync(async ({ params }, res) => {
    const data = await SalonServices.gallery(params.salonId);

    serveResponse(res, {
      message: 'Gallery retrieved successfully!',
      data,
    });
  }),

  byCategory: catchAsync(async ({ params }, res) => {
    const data = await SalonServices.byCategory(params.categoryId);

    serveResponse(res, {
      message: 'Salons retrieved successfully!',
      data,
    });
  }),

  search: catchAsync(async ({ query }, res) => {
    const data = await SalonServices.search(query);

    serveResponse(res, {
      message: 'Salons retrieved successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    const salon = await SalonServices.delete(params.salonId);

    serveResponse(res, {
      message: `${salon?.name ?? 'Salon'} deleted successfully!`,
    });
  }),
};
