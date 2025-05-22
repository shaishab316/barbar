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
  address: {
    type: String,
    default: '',
  },
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
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default: '/images/logo.png',
    },
    location: {
      type: locationSchema,
    },
    gallery: [
      {
        image: {
          type: String,
        },
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ratingCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    gender: {
      type: String,
      enum: Object.values(EUserGender),
      default: EUserGender.MALE,
    },
    businessHours: {
      ...Object.fromEntries(
        week.map(day => [
          day,
          {
            start: { type: String, default: '00:00' },
            end: { type: String, default: '00:00' },
            isOpen: { type: Boolean, default: true },
          },
        ]),
      ),
    },
    contact: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, versionKey: false },
);

salonSchema.index({ location: '2dsphere' });

const Salon = model<TSalon>('Salon', salonSchema);

export default Salon;
