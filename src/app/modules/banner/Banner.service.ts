import { Types } from 'mongoose';
import { TBanner } from './Banner.interface';
import Banner from './Banner.model';
import deleteFile from '../../../util/file/deleteFile';

export const BannerServices = {
  async create(bannerData: TBanner) {
    return Banner.create(bannerData);
  },

  async list() {
    return Banner.find();
  },

  async delete(bannerId: Types.ObjectId) {
    const { image } = (await Banner.findByIdAndDelete(bannerId))!;

    await deleteFile(image);
  },
};
