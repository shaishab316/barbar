import { Types } from 'mongoose';
import { TService } from './Service.interface';
import Service from './Service.model';
import { SalonServices } from '../salon/Salon.service';

export const ServiceServices = {
  async create(serviceData: TService, userId: Types.ObjectId) {
    const salon = await SalonServices.salon(userId);

    serviceData.salon = salon._id;

    return Service.create(serviceData);
  },
};
