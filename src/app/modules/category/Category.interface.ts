import { Types } from 'mongoose';

export type TCategory = {
  _id?: Types.ObjectId;

  admin: Types.ObjectId;
  name: string;
  banner: string;
};
