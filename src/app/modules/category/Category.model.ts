import { Schema, model } from 'mongoose';
import { TCategory } from './Category.interface';

const categorySchema = new Schema<TCategory>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    banner: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

const Category = model<TCategory>('Category', categorySchema);

export default Category;
