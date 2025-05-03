import { Types } from 'mongoose';
import { TService } from './Service.interface';
import Service from './Service.model';
import { SalonServices } from '../salon/Salon.service';
import deleteFile from '../../../util/file/deleteFile';
import { TList } from '../query/Query.interface';

export const ServiceServices = {
  async create(serviceData: TService, userId: Types.ObjectId) {
    const salon = await SalonServices.salon(userId);

    serviceData.salon = salon._id;

    return Service.create(serviceData);
  },

  async edit(serviceId: Types.ObjectId, serviceData: TService) {
    const service = (await Service.findById(serviceId))!;

    const oldBanner = service.banner;

    Object.assign(service, serviceData);
    await service.save();

    if (serviceData.banner) await deleteFile(oldBanner);

    return service;
  },

  async delete(serviceId: Types.ObjectId) {
    const { banner } = (await Service.findByIdAndDelete(serviceId))!;

    return deleteFile(banner);
  },

  async list({ page, limit, salon }: TList & { salon: Types.ObjectId }) {
    const services = await Service.find({ salon })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Service.countDocuments({ salon });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        query: {
          salon,
        },
      },
      services,
    };
  },

  async retrieve(serviceId: Types.ObjectId) {
    return Service.findById(serviceId);
  },
};
