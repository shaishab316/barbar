import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
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

  delete: catchAsync(async ({ params, user }, res) => {
    await ReviewServices.delete(params.reviewId, user as any);

    serveResponse(res, {
      message: 'Review deleted successfully!',
    });
  }),
};
