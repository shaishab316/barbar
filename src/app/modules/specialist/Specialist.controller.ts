import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { SpecialistServices } from './Specialist.service';

export const SpecialistControllers = {
  create: catchAsync(async ({ body, user }, res) => {
    const data = await SpecialistServices.create(body, user!._id!);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Specialist created successfully!',
      data,
    });
  }),

  edit: catchAsync(async ({ body, params }, res) => {
    const data = await SpecialistServices.edit(params.specialistId, body);

    serveResponse(res, {
      message: 'Specialist updated successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    await SpecialistServices.delete(params.specialistId);

    serveResponse(res, {
      message: 'Specialist deleted successfully!',
    });
  }),

  list: catchAsync(async ({ query }, res) => {
    const { meta, specialists } = await SpecialistServices.list(query);

    serveResponse(res, {
      message: 'Specialists retrieved successfully!',
      meta,
      data: specialists,
    });
  }),
};
