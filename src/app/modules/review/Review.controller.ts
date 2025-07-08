import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { SalonServices } from '../salon/Salon.service';
import { ReviewServices } from './Review.service';

export const ReviewControllers = {
  store: catchAsync(async ({ body, user, params }, res) => {
    const data = await ReviewServices.store({
      ...body,
      user: user?._id,
      salon: params.salonId,
    });

    serveResponse(res, {
      message: 'Review given successfully!',
      data,
    });
  }),

  list: catchAsync(async ({ query }, res) => {
    const { meta, reviews } = await ReviewServices.list(query);

    serveResponse(res, {
      message: 'Reviews retrieved successfully!',
      meta,
      data: reviews,
    });
  }),

  retrieve: catchAsync(async ({ params, query }, res) => {
    const { meta, reviews } = await ReviewServices.list({
      ...query,
      salon: params.salonId,
    });

    serveResponse(res, {
      message: 'Reviews retrieved successfully!',
      meta,
      data: reviews,
    });
  }),

  retrieveForHost: catchAsync(async ({ user, query }, res) => {
    const salon = await SalonServices.salon(user!._id!);

    if (!salon) {
      return serveResponse(res, {
        statusCode: 404,
        message: 'Salon not found!',
      });
    }

    const { meta, reviews } = await ReviewServices.list({
      ...query,
      salon: salon._id,
    });

    serveResponse(res, {
      message: 'Reviews retrieved successfully!',
      meta,
      data: reviews,
    });
  }),

  delete: catchAsync(async ({ params, user }, res) => {
    await ReviewServices.delete(params.reviewId, user as any);

    serveResponse(res, {
      message: 'Review deleted successfully!',
    });
  }),

  like: catchAsync(async ({ params, user }, res) => {
    await ReviewServices.like(params.reviewId, user!._id!);

    serveResponse(res, {
      message: 'Review liked successfully!',
    });
  }),

  unlike: catchAsync(async ({ params, user }, res) => {
    await ReviewServices.unlike(params.reviewId, user!._id!);

    serveResponse(res, {
      message: 'Review unlike successfully!',
    });
  }),
};
