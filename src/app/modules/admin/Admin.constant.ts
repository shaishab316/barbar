import config from '../../../config';
import { EUserRole, EUserStatus } from '../user/User.enum';
import { TUser } from '../user/User.interface';

export const adminData: TUser = {
  ...config.admin,
  role: EUserRole.ADMIN,
  avatar: config.server.default_avatar,
  status: EUserStatus.ACTIVE,
};
