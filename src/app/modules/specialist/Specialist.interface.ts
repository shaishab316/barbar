import { Types } from 'mongoose';

export type TSpecialist = {
  _id?: Types.ObjectId;

  salon: Types.ObjectId;
  avatar: string;
  name: string;
  role: string;

  createdAt?: Date;
  updatedAt?: Date;
};
