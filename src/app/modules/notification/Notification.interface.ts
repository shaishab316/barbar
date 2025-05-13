import { Types } from 'mongoose';

export type TNotification = {
  _id?: Types.ObjectId;

  title: string;
  description: string;
  unRead?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};
