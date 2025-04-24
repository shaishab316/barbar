import { Types } from 'mongoose';
import { EUserRole, EUserStatus } from './User.enum';

export type TUser = {
  _id?: Types.ObjectId;
  name: string;
  avatar?: string;
  email?: string;
  password?: string;
  role: EUserRole;
  status: EUserStatus;
  otp?: number;
  otpExp?: Date;
  googleId?: string;
  facebookId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
