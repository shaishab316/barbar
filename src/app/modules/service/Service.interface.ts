import { Types } from 'mongoose';
import { EUserGender } from '../user/User.enum';

export type TService = {
  _id?: Types.ObjectId;

  salon: Types.ObjectId;
  name: string;
  category: string;
  price: number;
  duration: number;
  gender: EUserGender;

  createdAt?: Date;
  updatedAt?: Date;
};
