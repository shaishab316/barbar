import { z } from 'zod';
import User from '../user/User.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const OtpValidations = {
  send: z.object({
    body: z.object({
      email: z.string().superRefine(async email => {
        if (!(await User.exists({ email })))
          throw new ServerError(StatusCodes.NOT_FOUND, 'User does not exist');
      }),
    }),
  }),
};
