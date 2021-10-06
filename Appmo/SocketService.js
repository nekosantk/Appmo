import SocketIOClient from 'socket.io-client';
import {REACT_APP_BACKEND_BASEURL} from '@env';

export default class SocketService {
  static socket = null;
  static InitSocket(idToken) {
    socket = SocketIOClient(REACT_APP_BACKEND_BASEURL);

    socket.on('connect', () => {
      socket.emit("auth", idToken);
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

  static GetSocket() {
    return socket;
  }

  static Send(command, payload) {
      if (socket != null) {
        socket.emit(command, payload);
      }
      else {
          console.log("socket is null");
      }
  }
}
