import React, {useEffect, useState} from 'react';
import {StyleSheet, Button, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import SocketService from '../SocketService';

const HomeScreen = () => {
  async function SignOutGoogle() {
    return auth().signOut();
  }

  useEffect(() => {
    SocketService.InitSocket();
    return () => {
      SocketService.CloseSocket();
    };
  }, []);

  return (
    <View>
      <Button onPress={SocketService.Send} title="Say Hello" />
      <Button onPress={SignOutGoogle} title="Sign Out" />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
