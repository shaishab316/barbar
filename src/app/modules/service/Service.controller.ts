import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { ServiceServices } from './Service.service';

export const ServiceControllers = {
  // {{key}}: catchAsync(async (req, res) => {
  //   const data = await ServiceServices.{{key}}();
  //
  //   serveResponse(res, {
  //     // statusCode: StatusCodes.OK,
  //     message: 'Service [value] successfully!',
  //     data,
  //   });
  // }),
};
