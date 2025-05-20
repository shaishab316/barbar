import { Schema, model } from 'mongoose';
import { TAppointment } from './Appointment.interface';
import { EAppointmentState, EAppointmentType } from './Appointment.enum';
import autoPopulate from 'mongoose-autopopulate';
import { AppointmentMiddlewares } from './Appointment.middleware';

const appointmentSchema = new Schema<TAppointment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salon: {
      type: Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
      autopopulate: { select: 'name banner location contact' },
    },
    specialist: {
      type: Schema.Types.ObjectId,
      ref: 'Specialist',
      required: true,
    },
    amount: {
      type: Number,
      min: 1,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(EAppointmentType),
      required: true,
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        autopopulate: { select: 'name price' },
      },
    ],
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
    },
    receipt: {
      type: String,
    },
    state: {
      type: String,
      enum: Object.values(EAppointmentState),
      default: EAppointmentState.PENDING,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

AppointmentMiddlewares.schema(appointmentSchema);

appointmentSchema.plugin(autoPopulate);

const Appointment = model<TAppointment>('Appointment', appointmentSchema);

export default Appointment;
