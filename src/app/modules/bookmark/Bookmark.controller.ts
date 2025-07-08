import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { BookmarkServices } from './Bookmark.service';

export const BookmarkControllers = {
  add: catchAsync(async ({ params, user }, res) => {
    await BookmarkServices.add({
      salon: params.salonId,
      user: user!._id!,
    });

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Bookmark added successfully!',
    });
  }),

  remove: catchAsync(async ({ params }, res) => {
    await BookmarkServices.remove(params.bookmarkId);

    serveResponse(res, {
      message: 'Bookmark removed successfully!',
    });
  }),

  list: catchAsync(async ({ user, query }, res) => {
    const { bookmarks, meta } = await BookmarkServices.list({
      ...query,
      user: user!._id!,
    });

    serveResponse(res, {
      message: 'Bookmarks retrieved successfully!',
      meta,
      data: bookmarks,
    });
  }),
};
