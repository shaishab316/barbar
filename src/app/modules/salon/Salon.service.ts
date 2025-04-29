import { Types } from 'mongoose';
import { TSalon } from './Salon.interface';
import Salon from './Salon.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { TList } from '../query/Query.interface';

export const SalonServices = {
  async create(salonData: TSalon) {
    return Salon.findOneAndUpdate({ host: salonData.host }, salonData, {
      upsert: true,
      new: true,
    });
  },

  async uploadIntoGallery(host: Types.ObjectId, images: string[]) {
    const salonId = (await Salon.findOne({ host }).select('_id'))?._id;

    if (!salonId)
      throw new ServerError(StatusCodes.NOT_FOUND, 'Salon not found!');

    return Salon.findOneAndUpdate(
      { _id: salonId },
      { $push: { gallery: { $each: images.map(image => ({ image })) } } },
      { new: true },
    );
  },

  async deleteFromGallery(salonId: Types.ObjectId, imageId: string) {
    return Salon.updateOne(
      { _id: salonId },
      { $pull: { gallery: { _id: imageId.oid } } },
    );
  },

  async list({ page, limit }: TList) {
    const salons = await Salon.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Salon.countDocuments();

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      salons,
    };
  },
};
