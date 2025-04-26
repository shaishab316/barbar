import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { BannerServices } from './Banner.service';

export const BannerControllers = {
  list: catchAsync(async (_, res) => {
    const data = await BannerServices.list();

    serveResponse(res, {
      message: 'Banners retrieved successfully!',
      data,
    });
  }),

  retrieve: catchAsync(async (_, res) => {
    const data = (await BannerServices.list()).map(({ image }) => image);

    serveResponse(res, {
      message: 'Banners retrieved successfully!',
      data,
    });
  }),

  create: catchAsync(async ({ body, user }, res) => {
    const data = await BannerServices.create({ ...body, admin: user?._id });

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Banner created successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    await BannerServices.delete(params.bannerId);

    serveResponse(res, {
      message: 'Banner deleted successfully!',
    });
  }),
};
