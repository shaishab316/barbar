import { Schema, model } from 'mongoose';
import { TBanner } from './Banner.interface';

const bannerSchema = new Schema<TBanner>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Banner = model<TBanner>('Banner', bannerSchema);

export default Banner;
