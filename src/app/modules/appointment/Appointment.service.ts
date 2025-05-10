import { EAppointmentState } from './Appointment.enum';
import { TAppointment } from './Appointment.interface';
import Appointment from './Appointment.model';

export const AppointmentServices = {
  async create(appointmentData: TAppointment) {
    return Appointment.create(appointmentData);
  },

  async changeState(appointmentId: string, state: EAppointmentState) {
    return Appointment.findByIdAndUpdate(appointmentId, { state });
  },
};
