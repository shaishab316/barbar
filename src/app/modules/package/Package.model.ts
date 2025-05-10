import { Schema, model } from 'mongoose';
import { TPackage } from './Package.interface';
import autoPopulate from 'mongoose-autopopulate';

const packageSchema = new Schema<TPackage>(
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
    description: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
        autopopulate: {
          select: 'name banner price',
        },
      },
    ],
    note: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

packageSchema.plugin(autoPopulate);

const Package = model<TPackage>('Package', packageSchema);

export default Package;
