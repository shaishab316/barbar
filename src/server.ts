import './util/prototype'; //! must be first
import startServer from './util/server/startServer';
import { SocketService } from './app/modules/socket/Socket.service';

startServer().then(server => {
  /** Micro services */
  SocketService.init(server);
});
