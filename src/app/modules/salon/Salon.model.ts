import { Schema, model } from 'mongoose';
import { TLocation, TSalon } from './Salon.interface';
import { EUserGender } from '../user/User.enum';
import { week } from './Salon.constant';

const locationSchema = new Schema<TLocation>({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
  address: String,
});

const salonSchema = new Schema<TSalon>(
  {
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    gallery: [
      {
        image: {
          type: String,
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    gender: {
      type: String,
      enum: Object.values(EUserGender),
      required: true,
    },
    businessHours: {
      ...Object.fromEntries(
        week.map(day => [
          day,
          {
            start: { type: String, required: true },
            end: { type: String, required: true },
            isOpen: { type: Boolean, required: true, default: true },
          },
        ]),
      ),
    },
    contacts: [
      {
        type: String,
        required: true,
      },
    ],
    website: String,
  },
  { timestamps: true, versionKey: false },
);

salonSchema.index({ location: '2dsphere' });

const Salon = model<TSalon>('Salon', salonSchema);

export default Salon;
