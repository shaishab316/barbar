import { Schema, model } from 'mongoose';
import { TMessage } from './Message.interface';

const messageSchema = new Schema<TMessage>(
  {},
  { timestamps: true, versionKey: false },
);

const Message = model<TMessage>('Message', messageSchema);

export default Message;
