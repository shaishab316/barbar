/* eslint-disable no-unused-vars */
import { Types } from 'mongoose';
import { EUserGender } from '../user/User.enum';
import { week } from './Salon.constant';

export type TSalon = {
  _id?: Types.ObjectId;

  host: Types.ObjectId;
  name: string;
  banner: string;
  location: TLocation;
  gender: EUserGender;
  gallery: {
    image: string;
    _id: Types.ObjectId;
  }[];
  contacts: string[];
  website?: string;
  rating: number;
  businessHours: TBusinessHours;

  createdAt?: Date;
  updatedAt?: Date;
};

export type TBusinessHours = {
  [day in (typeof week)[number]]: {
    start: string;
    end: string;
    isOpen: boolean;
  };
};

export type TLocation = {
  type: string;
  coordinates: [number, number];
  address: string;
};
