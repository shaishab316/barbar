import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { AppointmentServices } from './Appointment.service';
import ServerError from '../../../errors/ServerError';
import { EAppointmentState } from './Appointment.enum';
import { SalonServices } from '../salon/Salon.service';
import { NotificationServices } from '../notification/Notification.service';
import Salon from '../salon/Salon.model';
import { AppointmentTemplates } from './Appointment.template';
import { EUserRole } from '../user/User.enum';

export const AppointmentControllers = {
  create: catchAsync(async ({ body, user, params }, res) => {
    const data = await AppointmentServices.create({
      ...body,
      user: user?._id,
      salon: params.salonId,
    });

    const salon = await Salon.findById(params.salonId);

    await NotificationServices.create({
      title: `${user?.name} has made an appointment`,
      description: `${user?.name} has made an appointment on ${salon?.name} at ${new Date()}`,
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

  retrieve: catchAsync(async ({ params }, res) => {
    const data = await AppointmentServices.retrieve(params.appointmentId);

    serveResponse(res, {
      message: 'Appointment retrieved successfully!',
      data,
    });
  }),

  receipt: catchAsync(async ({ params, query }, res) => {
    const appointment: any = await AppointmentServices.retrieve(
      params.appointmentId,
    );

    const receipt = await AppointmentTemplates.receipt(
      appointment,
      query?.role as EUserRole,
    ).toPdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="appointment-${appointment?.salon?.name}-${appointment?._id}.pdf"`,
    });

    res.send(receipt);
  }),
};
