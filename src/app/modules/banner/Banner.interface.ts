import { Types } from 'mongoose';

export type TBanner = {
  _id?: Types.ObjectId;

  admin: Types.ObjectId;
  image: string;
  name: string;

  createdAt?: Date;
  updatedAt?: Date;
};
