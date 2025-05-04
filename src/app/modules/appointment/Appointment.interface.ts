import { Types } from 'mongoose';
import { EAppointmentState, EAppointmentType } from './Appointment.enum';

export type TAppointment = {
  _id?: Types.ObjectId;

  user: Types.ObjectId;
  salon: Types.ObjectId;
  specialist: Types.ObjectId;
  amount: number;
  date: Date;
  type: EAppointmentType;
  services?: Types.ObjectId[];
  package?: Types.ObjectId;
  state: EAppointmentState; 

  createdAt?: Date;
  updatedAt?: Date;
};
