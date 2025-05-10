import { Types } from 'mongoose';

export type TChat = {
  _id?: Types.ObjectId;

  users: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
};
