import { Schema, model } from 'mongoose';
import { TSpecialist } from './Specialist.interface';

const specialistSchema = new Schema<TSpecialist>(
  {
    salon: {
      type: Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

const Specialist = model<TSpecialist>('Specialist', specialistSchema);

export default Specialist;
