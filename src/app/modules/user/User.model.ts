import { model, Schema } from 'mongoose';
import { TUser } from './User.interface';
import { UserMiddlewares } from './User.middleware';
import { EUserRole, EUserStatus } from './User.enum';
import config from '../../../config';
const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    avatar: {
      type: String,
      default: config.server.default_avatar,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: [EUserRole.ADMIN, EUserRole.USER],
      default: EUserRole.USER,
    },
    googleId: {
      type: String,
      select: false,
    },
    facebookId: {
      type: String,
      select: false,
    },
    status: {
      type: String,
      enum: [EUserStatus.ACTIVE, EUserStatus.INACTIVE],
      default: EUserStatus.INACTIVE,
    },
    otp: Number,
    otpExp: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.inject(UserMiddlewares.schema);

const User = model<TUser>('User', userSchema);

export default User;
