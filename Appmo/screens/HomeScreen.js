import React, {useEffect} from 'react';
import {
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import SocketService from '../SocketService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatPanel from '../components/ChatPanel';
import {useState} from '@hookstate/core';
import Store from '../components/Store';
import Contacts from 'react-native-contacts';
import auth from '@react-native-firebase/auth';
import {REACT_APP_BACKEND_BASEURL, REACT_APP_PROFILE_PICTURE_PATH} from '@env';
import HomeScreenHeaderPanel from '../components/HomeScreenHeaderPanel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation}) => {
  const {chats, contactList, myProfile} = useState(Store);

  const HandleMessage = newMessage => {
    var chatStack = chats.get();
    var contactStack = contactList.get();

    // Get chat specific info
    var entityStack = chatStack.find(obj => {
      return obj.entityID === newMessage.senderID;
    });

    // Get contact name
    var entityContact = contactStack.find(obj => {
      return obj.emailAddress === newMessage.senderID;
    });

    // Set message variables
    var entityID = newMessage.senderID;
    var chatName = entityContact ? entityContact.displayName : entityID; // Get from contact list
    var avatarUrl =
      'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'; // Placeholder until we fetch real profile picture
    var newMessage = {
      text: newMessage.text,
      timestamp: newMessage.timestamp,
      senderID: newMessage.senderID,
    };

    // This is a new chat, please create entity
    if (entityStack === undefined) {
      chats.merge([
        {
          chatID: chatStack.length,
          entityID: entityID,
          chatName: chatName,
          avatarUrl: avatarUrl,
          messages: [newMessage],
        },
      ]);
    }
    // This chat already exists, just add on the new messsage
    else {
      chats[entityStack.chatID].merge(p => ({
        entityID: entityID,
        chatName: p.chatName,
        avatarUrl: p.avatarUrl,
        messages: [...p.messages, newMessage],
      }));
    }

    StoreData("chats", chats.get());
  };

  const HandleProfileData = async data => {
    var avatarUrl =
      REACT_APP_BACKEND_BASEURL +
      REACT_APP_PROFILE_PICTURE_PATH +
      data.profilePicture;

    var statusMessage = data.statusMessage;

    myProfile.merge(p => ({
      avatarUrl: avatarUrl,
      statusMessage: statusMessage,
      messagesSent: p.messagesSent ?? 0,
    }));

    StoreData('myProfile', myProfile.get());
  };

  const HandleContactData = data => {
    var chatStack = chats.get();
    var contactStack = contactList.get();

    var arrayLength = data.length;
    for (var i = 0; i < arrayLength; i++) {
      // Get chat specific info
      var entityStack = chatStack.find(obj => {
        return obj.entityID === data[i].email;
      });

      // Get contact name
      var entityContact = contactStack.find(obj => {
        return obj.emailAddress === data[i].email;
      });

      // Set variables
      var avatarUrl =
        REACT_APP_BACKEND_BASEURL +
        REACT_APP_PROFILE_PICTURE_PATH +
        data[i].profilePicture;

      var statusMessage = data[i].statusMessage;

      if (
        entityStack !== undefined &&
        entityStack.avatarUrl !== data[i].profilePicture
      ) {
        chats[entityStack.chatID].merge(p => ({
          avatarUrl: avatarUrl,
          statusMessage: statusMessage,
        }));
      }

      if (
        entityContact !== undefined &&
        chatStack.avatarUrl !== data[i].profilePicture
      ) {
        contactList[entityContact.contactID].merge(p => ({
          avatarUrl: avatarUrl,
          statusMessage: statusMessage,
        }));
      }
    }
    StoreData("contactList", contactList.get());
  };

  const HandleMessageStatusUpdatea = data => {
    var chatStack = chats.get();

    var entityStack = chatStack.find(obj => {
      return obj.entityID === data.senderID;
    });

    var index;

    if (entityStack !== undefined) {
      for (i = 0; i < entityStack.messages.length; i++) {
        var currentMessage = entityStack.messages[i];
        if (currentMessage.internalID == data.internalID) {
          index = i;
          break;
        }
      }
      if (index !== undefined) {
        chats[entityStack.chatID]['messages'][index]['status'].set(data.status);
      }
    }
    StoreData("chats", chats.get());
  };

  const SetupSocketEvents = () => {
    socket.on('contactData', data => {
      HandleContactData(data);
    });
    socket.on('message', data => {
      HandleMessage(data);
    });
    socket.on('profileData', data => {
      HandleProfileData(data);
    });
    socket.on('messageStatusUpdate', data => {
      HandleMessageStatusUpdatea(data);
    });
  };

  const RefreshContactList = async () => {
    await Contacts.getAll()
      .then(contacts => {
        let newArr = contacts
          .filter(contact => contact.emailAddresses.length != 0)
          .map((v, index) => ({
            contactID: index,
            recordID: v.recordID,
            emailAddress: v.emailAddresses[0]['email'],
            displayName: v.givenName + ' ' + v.familyName,
            avatarUrl:
              'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
            statusMessage: '',
          }));

        contactList.set(newArr);
      })
      .catch(e => {
        console.log(e);
      });

    Contacts.getCount().then(count => {
      //console.log('Found ' + count + ' contacts.');
    });

    Contacts.checkPermission();
  };

  const RefreshData = async () => {
    // Load profile information from storage
    var myProfileData = await GetData('myProfile');
    if (myProfileData !== null) {
      myProfile.merge(p => ({
        avatarUrl: myProfileData.avatarUrl,
        statusMessage: myProfileData.statusMessage,
        messagesSent: myProfileData.messagesSent,
      }));
    }

    // Load chats from storage
    var chatsData = await GetData('chats');
    if (chatsData !== null) {
      chats.set(chatsData);
    }

    var contactListData = await GetData('contactList');
    if (contactListData !== null)
    {
      contactList.set(contactListData);
    }

    let myID = auth().currentUser.email;

    const profileUpdate = setInterval(function () {
      SocketService.Send('getProfileInfo', myID);
    }, 1000);

    const chatUpdate = setInterval(function () {
      let chatIDs = chats.get().map(v => ({
        emailAddress: v.entityID,
      }));
      SocketService.Send('getContactInfo', chatIDs);
    }, 1000);

    const messageStatusUpdate = setInterval(function () {
      SocketService.Send('getMessageStatusUpdate', '');
    }, 1000);

    const contactUpdate = setInterval(function () {
      let contactListIDs = contactList.get().map(v => ({
        emailAddress: v.emailAddress,
      }));
      SocketService.Send('getContactInfo', contactListIDs);
    }, 1000);

    setTimeout(function () {
      SocketService.Send('getPendingMessages', '');
    }, 1000);
  };

  const ContactsButton = () => {
    navigation.navigate('Contacts');
  };

  const StoreData = async (key, value) => {
    try {
      await AsyncStorage.setItem('@' + key, JSON.stringify(value));
    } catch (e) {
      console.log("Couldn't save: " + e);
    }
  };

  const GetData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem('@' + key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("Couldn't read: " + e);
    }
  };

  useEffect(() => {
    auth()
      .currentUser.getIdToken()
      .then(function (idToken) {
        SocketService.InitSocket(idToken);
        SetupSocketEvents();
        if (Platform.OS === 'android') {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Contacts',
              message: 'This app would like to view your contacts.',
            },
          ).then(() => {
            RefreshContactList();
          });
        } else {
          RefreshContactList();
        }
      });
    RefreshData();
    return () => {
      SocketService.CloseSocket();
    };
  }, []);
  return (
    <SafeAreaView style={styles.Screen}>
      <HomeScreenHeaderPanel navigation={navigation} />
      <ScrollView>
        {[...chats.get()]
          .sort((a, b) => {
            if (
              a.messages[a.messages.length - 1].timestamp >
              b.messages[b.messages.length - 1].timestamp
            )
              return -1;
            if (
              a.messages[a.messages.length - 1].timestamp <
              b.messages[b.messages.length - 1].timestamp
            )
              return 1;
            return 0;
          })
          .map(({chatID, entityID, messages, avatarUrl, chatName}) => (
            <ChatPanel
              key={chatID}
              entityID={entityID}
              messages={messages}
              avatarUrl={avatarUrl}
              chatName={chatName}
              navigation={navigation}
            />
          ))}
      </ScrollView>
      <View>
        <TouchableOpacity
          onPress={ContactsButton}
          style={styles.ContactsButton}>
          <MaterialCommunityIcons
            name="chat-plus-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    backgroundColor: '#99AAAB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignSelf: 'flex-end',
  },
});
