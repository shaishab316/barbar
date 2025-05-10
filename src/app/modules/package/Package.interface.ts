import { Types } from 'mongoose';

export type TPackage = {
  _id?: Types.ObjectId;

  salon: Types.ObjectId;
  name: string;
  description: string;
  banner: string;
  services: Types.ObjectId[];
  note: string;
  price: number;

  createdAt?: Date;
  updatedAt?: Date;
};
