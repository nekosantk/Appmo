import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useState} from '@hookstate/core';
import Store from '../components/Store';
import {useState as useStateLocal} from 'react';
import SocketService from '../SocketService';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {REACT_APP_BACKEND_BASEURL} from '@env';
import { Socket } from 'socket.io-client';

const ProfileScreen = () => {
  const {myProfile} = useState(Store);
  const [statusMessage, updateStatusMessage] = useStateLocal('');

  const EditProfilePicture = () => {
    let options = {
        mediaType: "photo",
        includeBase64: true
    };
    launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            //alert('User cancelled to pick the image');
            return;
        } else if (response.errorCode == 'camera_unavailable') {
            //alert('Camera not available on device');
            return;
        } else if (response.errorCode == 'permission') {
            //alert('Permission not satisfied');
            return;
        } else if (response.errorCode == 'others') {
            //alert(response.errorMessage);
            return;
        }
        
        SocketService.Send('updateProfilePicture',  response.assets[0].base64);

        //console.log('base64 => ', response.base64);
        // console.log('uri => ', response.uri);
        // console.log('width => ', response.width);
        // console.log('height => ', response.height);
        // console.log('fileSize => ', response.fileSize);
        // console.log('type => ', response.type);
        // console.log('fileName => ', response.fileName);
    });
  };

  const EditStatusMessage = () => {
    SocketService.Send('updateStatusMessage', statusMessage);
  };

  useEffect(() => {
    updateStatusMessage(myProfile.get().statusMessage);
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={EditProfilePicture}>
          <Avatar
            rounded
            source={{
              uri: myProfile.get().avatarUrl,
            }}
            style={styles.profilePicture}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Status</Text>
        <TextInput
          style={styles.statusText}
          onChangeText={updateStatusMessage}
          onSubmitEditing={EditStatusMessage}
          value={statusMessage}
          placeholder="Enter a status here"
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 30,
  },
  statusText: {
    fontSize: 15,
  },
  statusContainer: {
    width: 250,
    paddingTop: 35,
  },
  profilePicture: {
    width: 250,
    height: 250,
    marginTop: 50,
  },
  profilePictureOptions: {},
});
