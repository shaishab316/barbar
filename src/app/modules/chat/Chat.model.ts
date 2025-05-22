import { Schema, model } from 'mongoose';
import { TChat } from './Chat.interface';
import autoPopulate from 'mongoose-autopopulate';

const chatSchema = new Schema<TChat>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

chatSchema.plugin(autoPopulate);

const Chat = model<TChat>('Chat', chatSchema);

export default Chat;
