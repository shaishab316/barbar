import { Schema, model } from 'mongoose';
import { TBookmark } from './Bookmark.interface';

const bookmarkSchema = new Schema<TBookmark>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salon: {
      type: Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Bookmark = model<TBookmark>('Bookmark', bookmarkSchema);

export default Bookmark;
