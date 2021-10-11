import React, {useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import Store from '../components/Store';
import {useState} from '@hookstate/core';

const HomeScreenHeaderPanel = ({ navigation }) => {
  const {myProfile} = useState(Store);

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Avatar
          rounded
          source={{
            uri: myProfile.get().avatarUrl,
          }}
          style={styles.avatar}
        />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.appName}>Appmo</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreenHeaderPanel;

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  appName: {
    fontSize: 20,
    marginRight: 20,
  },
  searchButton: {
    marginRight: 10,
  },
});
