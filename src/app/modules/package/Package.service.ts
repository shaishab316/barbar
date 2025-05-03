import { Types } from 'mongoose';
import { SalonServices } from '../salon/Salon.service';
import { TPackage } from './Package.interface';
import Package from './Package.model';
import deleteFile from '../../../util/file/deleteFile';
import { TList } from '../query/Query.interface';

export const PackageServices = {
  async create(packageData: TPackage, userId: Types.ObjectId) {
    const salon = await SalonServices.salon(userId);

    packageData.salon = salon._id;

    return Package.create(packageData);
  },

  async edit(packageId: Types.ObjectId, packageData: TPackage) {
    // ! `package` is a reserved keyword
    const pkg = (await Package.findById(packageId))!;

    const oldBanner = pkg.banner;

    Object.assign(pkg, packageData);
    await pkg.save();

    if (packageData.banner) await deleteFile(oldBanner);

    return pkg;
  },

  async delete(packageId: Types.ObjectId) {
    const { banner } = (await Package.findByIdAndDelete(packageId))!;

    return deleteFile(banner);
  },

  async list({ page, limit, salon }: TList & { salon: Types.ObjectId }) {
    const packages = await Package.find({ salon })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Package.countDocuments({ salon });

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
      packages,
    };
  },

  async retrieve(packageId: Types.ObjectId) {
    return Package.findById(packageId);
  },
};
