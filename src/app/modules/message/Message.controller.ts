import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { MessageServices } from './Message.service';

export const MessageControllers = {
  // {{key}}: catchAsync(async (req, res) => {
  //   const data = await MessageServices.{{key}}();
  //
  //   serveResponse(res, {
  //     // statusCode: StatusCodes.OK,
  //     message: 'Message [value] successfully!',
  //     data,
  //   });
  // }),
};
