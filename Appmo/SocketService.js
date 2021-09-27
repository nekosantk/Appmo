import SocketIOClient from 'socket.io-client';
import {REACT_APP_BACKEND_BASEURL} from '@env';

export default class SocketService {
  static socket = null;
  static InitSocket() {
    socket = SocketIOClient(REACT_APP_BACKEND_BASEURL);

    socket.on('connect', () => {
      console.log('Connected');
    });
  }
  static CloseSocket() {
    console.log('Closing socket');
    if (socket != null) {
        socket.removeAllListeners(true);
      try {
        socket.disconnect();
      } finally {
        socket = null;
      }
    }
  }
  static Send() {
      if (socket != null) {
        socket.emit("message", "hello from client");
          console.log("Sent message");
      }
      else {
          console.log("socket is null");
      }
  }
}
