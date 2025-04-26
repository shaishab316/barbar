import { Schema, model } from 'mongoose';
import { TOtp } from './Otp.interface';

const otpSchema = new Schema<TOtp>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    exp: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  { versionKey: false },
);

const Otp = model<TOtp>('Otp', otpSchema);

export default Otp;
