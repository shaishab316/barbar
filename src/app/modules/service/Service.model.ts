import { Schema, model } from 'mongoose';
import { TService } from './Service.interface';
import ms from 'ms';
import config from '../../../config';
import { EUserGender } from '../user/User.enum';

const serviceSchema = new Schema<TService>(
  {
    salon: {
      type: Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: ms(config.salon.default_service_duration),
    },
    gender: {
      type: String,
      enum: Object.values(EUserGender),
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Service = model<TService>('Service', serviceSchema);

export default Service;
