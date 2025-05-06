import { Types } from 'mongoose';

export type TMessage = {
  _id?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
};
