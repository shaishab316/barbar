import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { AppointmentServices } from './Appointment.service';

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
    const data = await AppointmentServices.changeState(
      params.appointmentId,
      params.state,
      user!,
    );

    serveResponse(res, {
      message: `Appointment ${data?.state} successfully!`,
      data,
    });
  }),

  myAppointments: catchAsync(async ({ query, user }, res) => {
    const data = await AppointmentServices.list({
      ...query,
      user: user!._id,
    });

    serveResponse(res, {
      message: 'My appointments retrieved successfully!',
      data,
    });
  }),
};
