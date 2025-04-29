import { TSalon } from './Salon.interface';
import Salon from './Salon.model';

export const SalonServices = {
  async create(salonData: TSalon) {
    return Salon.findOneAndUpdate({ host: salonData.host }, salonData, {
      upsert: true,
      new: true,
    });
  },
};
