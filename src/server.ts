import './util/prototype';
import startServer from './util/server/startServer';
import socket from './util/socket';

startServer().then(server => {
  /** Micro services */
  socket(server);
});
