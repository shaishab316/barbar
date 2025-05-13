import { Types } from 'mongoose';
import { TList } from '../query/Query.interface';
import { TNotification } from './Notification.interface';
import Notification from './Notification.model';

export const NotificationServices = {
  async create(notificationData: TNotification) {
    return Notification.create(notificationData);
  },

  async read(notificationId: Types.ObjectId) {
    return Notification.findByIdAndUpdate(
      notificationId,
      { unRead: false },
      { new: true },
    );
  },

  async list({ page, limit }: TList) {
    const notifications = await Notification.find()
      .sort('-unRead -createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments();

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      notifications,
    };
  },

  async delete(notificationId: Types.ObjectId) {
    return Notification.findByIdAndDelete(notificationId);
  },

  async deleteRead() {
    return Notification.deleteMany({ unRead: false });
  },
};
