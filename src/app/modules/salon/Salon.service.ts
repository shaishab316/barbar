import { Types } from 'mongoose';
import { TSalon } from './Salon.interface';
import Salon from './Salon.model';
import { TList } from '../query/Query.interface';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import deleteFile from '../../../util/file/deleteFile';
import config from '../../../config';

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

    const image = salon?.gallery?.find(({ _id }) => _id.equals(imageId))?.image;

    if (!image) throw new ServerError(StatusCodes.NOT_FOUND, 'Image not found');

    await Salon.findOneAndUpdate(
      { _id: salon._id },
      { $pull: { gallery: { _id: imageId } } },
    );

    return deleteFile(image);
  },

  async list({
    page,
    limit,
    longitude,
    latitude,
  }: TList & Record<string, any>) {
    const filter: any = {};

    if (longitude || latitude) {
      if (!longitude || !latitude)
        throw new ServerError(
          StatusCodes.BAD_REQUEST,
          `${!longitude ? 'longitude' : 'latitude'} is missing`,
        );

      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: config.salon.location_distance,
        },
      };
    }

    const salons = await Salon.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name banner rating location');

    const total = await Salon.countDocuments(filter);

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
    const salon: any = await Salon.findById(salonId).lean();

    salon.banners = [salon.banner].concat(
      salon.gallery.slice(0, 4).map(({ image }: any) => image),
    );

    salon.gallery = undefined;

    function convertToMinutes(time: string) {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }

    const now = new Date();
    const currentDay = now
      .toLocaleString('en-us', { weekday: 'long' })
      .toLowerCase();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes for easier comparison

    const businessHour = salon.businessHours[currentDay];
    const businessStartTime = convertToMinutes(businessHour.start);
    const businessEndTime = convertToMinutes(businessHour.end);

    salon.isOpen =
      businessHour.isOpen &&
      currentTime >= businessStartTime &&
      currentTime <= businessEndTime;

    return salon;
  },

  async salon(host: Types.ObjectId) {
    const salon = await Salon.findOne({ host });

    if (!salon) throw new ServerError(StatusCodes.NOT_FOUND, 'Salon not found');

    return salon;
  },

  async gallery(salonId: Types.ObjectId) {
    const salon = await Salon.findById(salonId).select('gallery');

    return salon?.gallery;
  },
};
