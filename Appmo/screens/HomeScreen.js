import React from 'react';
import {StyleSheet, Button, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {REACT_APP_BACKEND_AUTH, REACT_APP_BACKEND_BASEURL} from '@env';

const HomeScreen = () => {
  async function SignOutGoogle() {
    return auth().signOut();
  }

  return (
    <View>
      <Button onPress={SignOutGoogle} title="Sign Out" />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
