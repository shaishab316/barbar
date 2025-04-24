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

  create: catchAsync(async ({ body }, res) => {
    const data = await BannerServices.create(body);

    serveResponse(res, {
      message: 'Banner created successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    const data = await BannerServices.delete(params.bannerId);

    serveResponse(res, {
      message: 'Banner deleted successfully!',
      data,
    });
  }),
};
