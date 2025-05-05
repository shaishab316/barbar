import { Schema, model } from 'mongoose';
import { TReview } from './Review.interface';
import autoPopulate from 'mongoose-autopopulate';

const reviewSchema = new Schema<TReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: {
        select: 'name avatar',
      },
    },
    salon: {
      type: Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

reviewSchema.plugin(autoPopulate);

const Review = model<TReview>('Review', reviewSchema);

export default Review;
