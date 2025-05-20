import { Schema } from 'mongoose';
import { TAppointment } from './Appointment.interface';
import { AppointmentServices } from './Appointment.service';

export const AppointmentMiddlewares = {
  schema: (schema: Schema<TAppointment>) => {
    schema.pre('save', function (next) {
      if (!this.receipt) this.receipt = `/pdf/${this._id}.pdf`;

      next();
    });

    schema.post('save', async function (doc: any, next) {
      AppointmentServices.saveReceipt(doc._id); //! Don't use await

      next();
    });
  },
};
