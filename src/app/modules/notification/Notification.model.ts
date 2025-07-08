import { Schema, model } from 'mongoose';
import { TNotification } from './Notification.interface';

const notificationSchema = new Schema<TNotification>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    unRead: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Notification = model<TNotification>('Notification', notificationSchema);

export default Notification;
