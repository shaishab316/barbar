import { Types } from 'mongoose';

export type TReview = {
  _id?: Types.ObjectId;

  user: Types.ObjectId;
  salon: Types.ObjectId;
  rating: number;
  comment: string;
  likes: number;
  likedBy: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
};
