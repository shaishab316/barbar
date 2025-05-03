import { Types } from 'mongoose';
import { TSpecialist } from './Specialist.interface';
import Specialist from './Specialist.model';
import deleteFile from '../../../util/file/deleteFile';
import { SalonServices } from '../salon/Salon.service';
import { TList } from '../query/Query.interface';

export const SpecialistServices = {
  async create(specialistData: TSpecialist, userId: Types.ObjectId) {
    const salon = await SalonServices.salon(userId);

    specialistData.salon = salon._id;

    return Specialist.create(specialistData);
  },

  async edit(specialistId: Types.ObjectId, specialistData: TSpecialist) {
    const specialist = (await Specialist.findById(specialistId))!;

    const oldAvatar = specialist.avatar;

    Object.assign(specialist, specialistData);
    await specialist.save();

    if (specialistData.avatar) await deleteFile(oldAvatar);

    return specialist;
  },

  async delete(specialistId: Types.ObjectId) {
    const { avatar } = (await Specialist.findByIdAndDelete(specialistId))!;

    return deleteFile(avatar);
  },

  async list({ page, limit }: TList) {
    const specialists = await Specialist.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Specialist.countDocuments();

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      specialists,
    };
  },
};
