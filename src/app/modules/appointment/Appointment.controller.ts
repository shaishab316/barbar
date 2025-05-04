import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { AppointmentServices } from './Appointment.service';
import { EUserRole } from '../user/User.enum';
import { EAppointmentState } from './Appointment.enum';

export const AppointmentControllers = {
  create: catchAsync(async ({ body, user, params }, res) => {
    const data = await AppointmentServices.create({
      ...body,
      user: user?._id,
      salon: params.salonId,
    });

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Appointment created successfully!',
      data,
    });
  }),

  changeState: catchAsync(async ({ params, user }, res) => {
    //! USER can only cancel appointments
    if (user?.role === EUserRole.USER)
      params.state = EAppointmentState.CANCELLED;

    const data = await AppointmentServices.changeState(
      params.appointmentId,
      params.state,
    );

    serveResponse(res, {
      message: `Appointment ${params.state} successfully!`,
      data,
    });
  }),
};
