import { Types } from 'mongoose';

export type TBookmark = {
  _id?: Types.ObjectId;

  user: Types.ObjectId;
  salon: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
};
