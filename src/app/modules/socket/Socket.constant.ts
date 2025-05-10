import chatSocket from '../chat/Chat.socket';
import { TSocketHandler } from './Socket.interface';

export const socketHandlers: TSocketHandler[] = [chatSocket];
