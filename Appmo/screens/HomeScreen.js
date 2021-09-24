import React from 'react';
import {StyleSheet, Button, View} from 'react-native';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  async function SignOutGoogle() {
    return auth().signOut();
  }

  return (
    <View>
      <Button
        onPress={SignOutGoogle}
        title="Sign Out"
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
