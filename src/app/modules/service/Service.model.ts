import { Schema, model } from 'mongoose';
import { TService } from './Service.interface';
import ms from 'ms';
import config from '../../../config';
import { EUserGender } from '../user/User.enum';
import autoPopulate from 'mongoose-autopopulate';

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
    banner: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      autopopulate: { select: 'name banner' },
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

serviceSchema.index({ salon: 1, name: 1, category: 1 }, { unique: true });

serviceSchema.plugin(autoPopulate);

const Service = model<TService>('Service', serviceSchema);

export default Service;
