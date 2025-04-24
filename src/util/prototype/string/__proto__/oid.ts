import { Types } from 'mongoose';

declare global {
  interface String {
    readonly oid: Types.ObjectId;
  }
}

Object.defineProperty(String.prototype, 'oid', {
  get() {
    return new Types.ObjectId(this as string);
  },
  enumerable: false,
});

export {};
