import { Types } from 'mongoose';
import deleteFile from '../../../util/file/deleteFile';
import { TList } from '../query/Query.interface';
import { TCategory } from './Category.interface';
import Category from './Category.model';

export const CategoryServices = {
  async create(categoryData: TCategory) {
    return Category.create(categoryData);
  },

  async list({ page, limit }: TList) {
    const categories = await Category.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Category.countDocuments();

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      categories,
    };
  },

  async edit(categoryId: Types.ObjectId, categoryData: TCategory) {
    const category = (await Category.findById(categoryId))!;

    const oldBanner = category.banner;

    Object.assign(category, categoryData);
    await category.save();

    if (categoryData.banner) await deleteFile(oldBanner);

    return category;
  },

  async delete(categoryId: Types.ObjectId) {
    const { banner } = (await Category.findByIdAndDelete(categoryId))!;

    return deleteFile(banner);
  },
};
