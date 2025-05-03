import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { PackageServices } from './Package.service';

export const PackageControllers = {
  create: catchAsync(async ({ body, user }, res) => {
    const data = await PackageServices.create(body, user!._id!);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Package created successfully!',
      data,
    });
  }),

  edit: catchAsync(async ({ body, params }, res) => {
    const data = await PackageServices.edit(params.packageId, body);

    serveResponse(res, {
      message: 'Package updated successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    await PackageServices.delete(params.packageId);

    serveResponse(res, {
      message: 'Package deleted successfully!',
    });
  }),

  list: catchAsync(async ({ query }, res) => {
    const { meta, packages } = await PackageServices.list(query);

    serveResponse(res, {
      message: 'Packages retrieved successfully!',
      meta,
      data: packages,
    });
  }),

  retrieve: catchAsync(async ({ params }, res) => {
    const data = await PackageServices.retrieve(params.packageId);

    serveResponse(res, {
      message: 'Package retrieved successfully!',
      data,
    });
  }),
};
