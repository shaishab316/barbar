import { Document, Types } from 'mongoose';
import { TReview } from './Review.interface';
import Review from './Review.model';
import { TList } from '../query/Query.interface';
import { TUser } from '../user/User.interface';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { EUserRole } from '../user/User.enum';

export const ReviewServices = {
  async store({ user, salon, rating, comment }: TReview) {
    return Review.findOneAndUpdate(
      { user, salon },
      { rating, comment },
      { upsert: true, new: true },
    );
  },

  async delete(reviewId: Types.ObjectId, user: TUser & Document) {
    const review = (await Review.findById(reviewId))!;

    if (
      user.role !== EUserRole.ADMIN ||
      review.user.toString() !== user._id!.toString()
    )
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to delete this review.',
      );

    return Review.findByIdAndDelete(reviewId);
  },

  async list({ page, limit, salon }: TList & { salon?: Types.ObjectId }) {
    const reviews = await Review.find({ salon })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments({ salon });

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
      reviews,
    };
  },
};
