import { TList } from '../query/Query.interface';
import { TBookmark } from './Bookmark.interface';
import Bookmark from './Bookmark.model';

export const BookmarkServices = {
  async add({ user, salon }: TBookmark) {
    return Bookmark.findOneAndUpdate(
      { user, salon },
      { updatedAt: new Date() },
      { upsert: true, new: true },
    );
  },

  async remove(bookmarkId: string) {
    return Bookmark.findByIdAndDelete(bookmarkId);
  },

  async list({ page, limit, user }: TList) {
    const bookmarks = await Bookmark.find({ user })
      .sort('-updatedAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('salon', 'name banner location rating');

    const total = await Bookmark.countDocuments({ user });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      bookmarks,
    };
  },
};
