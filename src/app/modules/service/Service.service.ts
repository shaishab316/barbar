import { Types } from 'mongoose';
import { TService } from './Service.interface';
import Service from './Service.model';
import { SalonServices } from '../salon/Salon.service';
import deleteFile from '../../../util/file/deleteFile';
import { TUser } from '../user/User.interface';
import { EUserRole } from '../user/User.enum';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import Salon from '../salon/Salon.model';

export const ServiceServices = {
  async create(serviceData: TService, userId: Types.ObjectId) {
    const salon = await SalonServices.salon(userId);

    serviceData.salon = salon._id;

    return Service.create(serviceData);
  },

  async edit(serviceId: Types.ObjectId, serviceData: TService, user: TUser) {
    const service = (await Service.findById(serviceId))!;

    await this.authorize(service.salon, user);

    const oldBanner = service.banner;

    Object.assign(service, serviceData);
    await service.save();

    if (serviceData.banner) await deleteFile(oldBanner);

    return service;
  },

  async delete(serviceId: Types.ObjectId, user: TUser) {
    const service = (await Service.findById(serviceId))!;

    await this.authorize(service.salon, user);

    await Service.findByIdAndDelete(serviceId);

    return deleteFile(service.banner);
  },

  async authorize(salonId: Types.ObjectId, user: TUser) {
    if (user.role !== EUserRole.ADMIN) {
      const salon = (await Salon.findById(salonId))!;

      if (!salon.host.equals(user._id))
        throw new ServerError(
          StatusCodes.FORBIDDEN,
          "You can't access this resource!",
        );
    }
  },

  async list(filter: TService) {
    return await Service.find(filter);
  },

  async categories(salonId: Types.ObjectId) {
    return Service.aggregate([
      { $match: { salon: salonId } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$categoryDetails' },
      {
        $group: {
          _id: '$category',
          name: { $first: '$categoryDetails.name' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: 1,
          count: 1,
        },
      },
    ]);
  },

  async retrieve(serviceId: Types.ObjectId) {
    return Service.findById(serviceId);
  },
};
