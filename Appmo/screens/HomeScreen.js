import React, {useEffect, useState} from 'react';
import {StyleSheet, Button, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import SocketIOClient from 'socket.io-client';
import {REACT_APP_BACKEND_BASEURL} from '@env';

const HomeScreen = () => {
  const [socket, setSocket] = useState();

  async function SignOutGoogle() {
    return auth().signOut();
  }

  useEffect(() => {
    InitSocket();
    return () => {
      CloseSocket();
    };
  }, []);

  function InitSocket() {
    const socket = SocketIOClient(REACT_APP_BACKEND_BASEURL);

    socket.on('connect', () => {
      console.log('Connected');
    });

    socket.on("disconnect", () => {
      console.log('Disconnected');
    });

    setSocket(socket);
  }

  function CloseSocket() {
    if (socket != null) {
      socket.removeAllListeners(true);
      try {
       socket.disconnect();
      } finally {
       setSocket(null);
      }
     }
  }

  return (
    <View>
      <Button onPress={SignOutGoogle} title="Sign Out" />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
