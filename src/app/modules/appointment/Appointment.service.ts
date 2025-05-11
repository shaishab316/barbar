import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import Service from '../service/Service.model';
import { EAppointmentState, EAppointmentType } from './Appointment.enum';
import { TAppointment } from './Appointment.interface';
import Appointment from './Appointment.model';

export const AppointmentServices = {
  async create(appointmentData: TAppointment) {
    const type = appointmentData.type;

    if (type === EAppointmentType.SERVICES) {
      if (!appointmentData.services?.length)
        throw new ServerError(StatusCodes.BAD_REQUEST, 'Services are required');

      delete appointmentData.package;

      const aggregateResult = await Service.aggregate([
        {
          $match: {
            _id: { $in: appointmentData.services },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$price' },
          },
        },
      ]);

      const totalAmount = aggregateResult[0]?.totalAmount;

      if (!totalAmount)
        throw new ServerError(
          StatusCodes.BAD_REQUEST,
          'Amount could not be calculated',
        );

      appointmentData.amount = totalAmount;
    } else {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'Invalid appointment type',
      );
      /** @todo implement package */
    }

    return Appointment.create(appointmentData);
  },

  async changeState(appointmentId: string, state: EAppointmentState) {
    return Appointment.findByIdAndUpdate(appointmentId, { state });
  },
};
