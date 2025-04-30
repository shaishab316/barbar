import { Types } from 'mongoose';
import { EUserGender } from '../user/User.enum';

export type TService = {
  _id?: Types.ObjectId;

  salon: Types.ObjectId;
  name: string;
  banner: string;
  category: Types.ObjectId;
  price: number;
  duration: number;
  gender: EUserGender;

  createdAt?: Date;
  updatedAt?: Date;
};
