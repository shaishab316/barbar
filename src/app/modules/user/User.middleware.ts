import { Schema } from 'mongoose';
import config from '../../../config';
import bcrypt from 'bcrypt';
import { TUser } from './User.interface';

export const UserMiddlewares = {
  schema: (schema: Schema<TUser>) => {
    schema.pre('save', async function (next) {
      if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(config.bcrypt_salt_rounds);
        this.password = await bcrypt.hash(this.password!, salt);
      }

      next();
    });

    schema.post('save', async function (doc: any, next) {
      doc.password = undefined;

      next();
    });
  },
};
