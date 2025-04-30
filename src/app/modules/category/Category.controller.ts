import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { CategoryServices } from './Category.service';

export const CategoryControllers = {
  create: catchAsync(async ({ body, user }, res) => {
    const data = await CategoryServices.create({ ...body, admin: user?._id });

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Category created successfully!',
      data,
    });
  }),

  list: catchAsync(async ({ query }, res) => {
    const { categories, meta } = await CategoryServices.list(query);

    serveResponse(res, {
      message: 'Categories retrieved successfully!',
      meta,
      data: categories,
    });
  }),

  edit: catchAsync(async ({ body, params }, res) => {
    const data = await CategoryServices.edit(params.categoryId, body);

    serveResponse(res, {
      message: 'Category updated successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    await CategoryServices.delete(params.categoryId);

    serveResponse(res, {
      message: 'Category deleted successfully!',
    });
  }),
};
