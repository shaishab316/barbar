import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { AppointmentServices } from './Appointment.service';
import ServerError from '../../../errors/ServerError';
import { EAppointmentState } from './Appointment.enum';
import { SalonServices } from '../salon/Salon.service';

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

    if (!data)
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        "You can't change other's appointments!",
      );

    serveResponse(res, {
      message: `Appointment ${data?.state} successfully!`,
      data,
    });
  }),

  listForUser: catchAsync(async ({ query, user }, res) => {
    const { appointments, meta } = await AppointmentServices.list({
      ...query,
      user: user!._id,
    });

    serveResponse(res, {
      message: 'My appointments retrieved successfully!',
      meta,
      data: appointments,
    });
  }),

  listForAdmin: catchAsync(async ({ query }, res) => {
    const { appointments, meta } = await AppointmentServices.list(query);

    const [pending, cancelled, approved] = await Promise.all([
      AppointmentServices.total({ state: EAppointmentState.PENDING }),
      AppointmentServices.total({ state: EAppointmentState.CANCELLED }),
      AppointmentServices.total({ state: EAppointmentState.APPROVED }),
    ]);

    serveResponse(res, {
      message: 'Appointments retrieved successfully!',
      meta: {
        ...meta,
        total: {
          pending,
          cancelled,
          approved,
        },
      },
      data: appointments,
    });
  }),

  listForHost: catchAsync(async ({ query, user }, res) => {
    const salon = await SalonServices.salon(user!._id!);

    const { appointments, meta } = await AppointmentServices.list({
      ...query,
      salon: salon?._id,
    });

    serveResponse(res, {
      message: 'Appointments retrieved successfully!',
      meta,
      data: appointments,
    });
  }),
};
