import { RootFilterQuery, Types } from 'mongoose';
import { TSalon } from './Salon.interface';
import Salon from './Salon.model';
import { TList } from '../query/Query.interface';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import deleteFile from '../../../util/file/deleteFile';
import Service from '../service/Service.model';
import Appointment from '../appointment/Appointment.model';
import Review from '../review/Review.model';
import Specialist from '../specialist/Specialist.model';

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
    sort,
    fields,
    search,
    longitude,
    latitude,
  }: TList & Record<string, any>) {
    const filter: RootFilterQuery<TSalon> = {};

    if (search)
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];

    if (longitude && latitude)
      filter.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      };

    const salons = await Salon.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .select(fields);

    //! countDocuments() does not support geo query
    if (longitude && latitude) delete filter.location;

    const total = await Salon.countDocuments(filter);

    return {
      salons,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        query: {
          fields,
          search,
          longitude,
          latitude,
        },
      },
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

  async byCategory(categoryId: Types.ObjectId) {
    return await Salon.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: 'salon',
          as: 'services',
        },
      },
      { $unwind: '$services' },
      { $match: { 'services.category': categoryId } },
      { $project: { name: 1, banner: 1, location: 1, rating: 1 } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          banner: { $first: '$banner' },
          location: { $first: '$location' },
          rating: { $first: '$rating' },
        },
      },
    ]);
  },

  async delete(salonId: Types.ObjectId) {
    const salon = await Salon.findByIdAndDelete(salonId);

    if (salon?.banner) await deleteFile(salon?.banner);

    await Service.deleteMany({ salon: salonId });
    await Appointment.deleteMany({ salon: salonId });
    await Review.deleteMany({ salon: salonId });
    await Specialist.deleteMany({ salon: salonId });

    return salon;
  },

  async search({ category, search, rating }: any) {
    const pipeline: any[] = [
      // STAGE 1: JOIN WITH SERVICES COLLECTION
      // Get all services for each salon by matching salon._id to services.salon
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: 'salon',
          as: 'services',
        },
      },

      // STAGE 2: UNWIND SERVICES ARRAY
      // Convert services array into individual documents (one per service)
      // This allows us to filter services in the next stage
      { $unwind: '$services' },

      // STAGE 3: FILTER DOCUMENTS
      // Apply all requested filters conditionally:
      // - Filter by service category if provided
      // - Filter by rating if provided
      // - Text search across salon name, description, and service names if provided
      {
        $match: {
          ...(category && { 'services.category': category }), // Only add if category exists
          ...(rating && { rating }), // Only add if rating exists
          ...(search && {
            // Only add if search exists
            $or: [
              { name: { $regex: search, $options: 'i' } }, // Search salon name
              { description: { $regex: search, $options: 'i' } }, // Search description
              { 'services.name': { $regex: search, $options: 'i' } }, // Search service names
            ],
          }),
        },
      },

      // STAGE 4: GROUP BY SALON ID
      // Since we unwinded services, we need to regroup to get one document per salon
      // $first keeps the original salon values (they're identical across service splits)
      {
        $group: {
          _id: '$_id', // Group by salon ID
          name: { $first: '$name' }, // Keep original name
          banner: { $first: '$banner' }, // Keep original banner
          location: { $first: '$location' }, // Keep original location
          rating: { $first: '$rating' }, // Keep original rating
        },
      },

      // STAGE 5: FINAL PROJECTION
      // Explicitly define which fields to include in results
      // This ensures we don't return any unexpected fields
      {
        $project: {
          _id: 1, // Include ID
          name: 1, // Include name
          banner: 1, // Include banner
          location: 1, // Include location
          rating: 1, // Include rating
        },
      },
    ];

    return Salon.aggregate(pipeline);
  },
};
