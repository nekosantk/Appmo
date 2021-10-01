import React, {useEffect, useState} from 'react';
import {StyleSheet, Button, View, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import SocketService from '../SocketService';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const HomeScreen = ({ navigation }) => {
  const ContactsButton = () => {
    navigation.navigate("Contacts");
  };

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
    <View style={styles.Screen}>
      <TouchableOpacity
        onPress={ContactsButton}
        style={styles.ContactsButton}>
        <MaterialCommunityIcons name="chat-plus-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
  },
  ContactsButton: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: "#99AAAB",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    alignSelf: "flex-end"
  },
});
