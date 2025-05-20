import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import Service from '../service/Service.model';
import { EAppointmentState, EAppointmentType } from './Appointment.enum';
import { TAppointment } from './Appointment.interface';
import Appointment from './Appointment.model';
import { Types } from 'mongoose';
import { TUser } from '../user/User.interface';
import { EUserRole } from '../user/User.enum';
import { SalonServices } from '../salon/Salon.service';
import { AppointmentTemplates } from './Appointment.template';
import { savePdf } from '../../../util/file/savePdf';

export const AppointmentServices = {
  async create(appointmentData: TAppointment) {
    const type = appointmentData.type;

    if (type === EAppointmentType.SERVICES) {
      if (!appointmentData.services?.length)
        throw new ServerError(StatusCodes.BAD_REQUEST, 'Services are required');

      delete appointmentData.package;

      const aggregateResult = await Service.aggregate([
        { $match: { _id: { $in: appointmentData.services } } },
        { $group: { _id: null, totalAmount: { $sum: '$price' } } },
      ]);

      const totalAmount = aggregateResult[0]?.totalAmount;
      if (!totalAmount)
        throw new ServerError(
          StatusCodes.BAD_REQUEST,
          'Amount could not be calculated',
        );

      appointmentData.amount = totalAmount;
    } else
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'Invalid appointment type',
      );

    const appointment = await Appointment.create(appointmentData);

    const fullAppointment = await this.retrieve(appointment._id);

    const receipt = await AppointmentTemplates.receipt(fullAppointment).toPdf();
    const receiptPath = await savePdf(receipt, `${appointment._id}.pdf`);

    appointment.receipt = receiptPath;
    await appointment.save();

    return appointment;
  },

  async changeState(
    appointmentId: Types.ObjectId,
    state: EAppointmentState,
    user: TUser,
  ) {
    const filter: any = { _id: appointmentId };

    //! USER can only cancel appointments
    if (user?.role === EUserRole.USER) {
      state = EAppointmentState.CANCELLED;
      filter.user = user._id;
    }

    //! HOST can only change his own salon's appointments
    if (user?.role === EUserRole.HOST) {
      const salon = await SalonServices.salon(user._id!);

      const appointment = await Appointment.findOne({
        _id: appointmentId,
        salon: salon._id,
      });

      //! it's not his own salon appointment
      if (!appointment) {
        state = EAppointmentState.CANCELLED;
        filter.user = user._id;
      }
    }

    return Appointment.findOneAndUpdate(filter, { state }, { new: true });
  },

  async list({ page, limit, search, ...filter }: any) {
    const pipeline: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$user' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            { $project: { name: 1, avatar: 1 } },
          ],
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'salons',
          let: { salonId: '$salon' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$salonId'] } } },
            { $project: { name: 1, banner: 1, location: 1 } },
          ],
          as: 'salon',
        },
      },
      { $unwind: '$salon' },
      {
        $lookup: {
          from: 'services',
          let: { serviceIds: '$services' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$serviceIds'] } } },
            { $project: { name: 1 } },
          ],
          as: 'services',
        },
      },
    ];

    if (search)
      pipeline.push({
        $match: {
          $or: [
            { 'user.name': { $regex: search, $options: 'i' } },
            { 'salon.name': { $regex: search, $options: 'i' } },
            { 'services.name': { $regex: search, $options: 'i' } },
          ],
        },
      });

    const total =
      (await Appointment.aggregate([...pipeline, { $count: 'total' }]))[0]
        ?.total ?? 0;

    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const appointments = await Appointment.aggregate(pipeline);

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        query: {
          search,
          ...filter,
        },
      },
      appointments,
    };
  },

  async total(filter: any) {
    return Appointment.countDocuments(filter);
  },

  async retrieve(appointmentId: Types.ObjectId) {
    return Appointment.findById(appointmentId)
      .populate('specialist', 'name')
      .populate('user', 'name phone');
  },
};
