import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import User from '../modules/user/User.model';
import { verifyToken } from '../modules/auth/Auth.utils';
import catchAsync from '../../util/server/catchAsync';
import { EUserRole } from '../modules/user/User.enum';

/**
 * Middleware to authenticate and authorize requests based on user roles
 *
 * @param roles - The roles that are allowed to access the resource
 */
const auth = (...roles: EUserRole[]) =>
  catchAsync(async (req, _, next) => {
    req.user = (await User.findById(
      verifyToken(req.headers.authorization?.split(' ')?.[1] ?? '', 'access')
        .userId,
    ))!;

    if (
      !req.user ||
      (roles[0] &&
        req.user.role !== EUserRole.ADMIN &&
        !roles.includes(req.user.role))
    )
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        'Sorry, you cannot access this resource!',
      );

    next();
  });

export default auth;
