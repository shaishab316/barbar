import { Types } from 'mongoose';
import { TSalon } from './Salon.interface';
import Salon from './Salon.model';
import { TList } from '../query/Query.interface';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import deleteFile from '../../../util/file/deleteFile';

export const SalonServices = {
  async upsert(salonData: TSalon) {
    return Salon.findOneAndUpdate({ host: salonData.host }, salonData, {
      upsert: true,
      new: true,
    });
  },

  async uploadIntoGallery(host: Types.ObjectId, images: string[]) {
    const salon = await this.salon(host);

    return Salon.findOneAndUpdate(
      { _id: salon?._id },
      { $push: { gallery: { $each: images.map(image => ({ image })) } } },
      { new: true },
    );
  },

  async deleteFromGallery(host: Types.ObjectId, imageId: Types.ObjectId) {
    const salon = await this.salon(host);

    const image = salon?.gallery.find(
      ({ _id }) => _id.toString() === imageId.toString(),
    )?.image;

    if (!image) throw new ServerError(StatusCodes.NOT_FOUND, 'Image not found');

    await Salon.findOneAndUpdate(
      { _id: salon._id },
      { $pull: { gallery: { _id: imageId } } },
    );

    return deleteFile(image);
  },

  async list({ page, limit }: TList) {
    const salons = await Salon.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name banner rating location');

    const total = await Salon.countDocuments();

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      salons,
    };
  },

  async retrieve(salonId: Types.ObjectId) {
    return Salon.findById(salonId);
  },

  async salon(host: Types.ObjectId) {
    const salon = await Salon.findOne({ host });

    if (!salon) throw new ServerError(StatusCodes.NOT_FOUND, 'Salon not found');

    return salon;
  },
};
