import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import catchAsync from '../../util/server/catchAsync';
import User from '../modules/user/User.model';

export const temUser = catchAsync(async (req, _, next) => {
  const user = await User.findOne({ email: req.body.email }).select('_id');

  if (!user)
    next(new ServerError(StatusCodes.UNAUTHORIZED, 'You are not authorized'));
  else req.user = user;

  next();
});
