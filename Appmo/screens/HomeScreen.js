import React, {useEffect, useContext} from 'react';
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

const HomeScreen = ({navigation}) => {
  const {chats, contactList} = useState(Store);

  const HandleMessage = newMessage => {
    var chatStack = chats.get();
    var contactStack = contactList.get();

    // Sort chats by newest -> oldest
    chatStack.sort((a, b) => {
      if (
        a.messages[a.messages.length - 1].timestamp <
        b.messages[b.messages.length - 1].timestamp
      )
        return -1;
      if (
        a.messages[a.messages.length - 1].timestamp >
        b.messages[b.messages.length - 1].timestamp
      )
        return 1;
      return 0;
    });

    // Get chat specific info
    var entityStack = chatStack.find(obj => {
      return obj.entityID === newMessage.entityID;
    });

    // Get contact name
    var entityContact = contactStack.find(obj => {
      return obj.emailAddress === newMessage.entityID;
    });

    // Set message variables
    var entityID = newMessage.entityID;
    var chatName = entityContact
      ? entityContact.displayName
      : 'NoName: ' + entityID; // Get from contact list TODO: store contactList in global state
    var avatarUrl =
      'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'; // Placeholder until we fetch real profile picture
    var newMessage = newMessage.message;

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
        avatarUrl: avatarUrl,
        messages: [...p.messages, newMessage],
      }));
    }
  };

  const SetupSocketEvents = () => {
    socket.on('contactData', data => {
      console.log('contactData: ' + data);
    });
  };

  const RefreshContacts = async () => {
    await Contacts.getAll()
      .then(contacts => {
        let newArr = contacts
          .filter(contact => contact.emailAddresses.length != 0)
          .map(v => ({
            recordID: v.recordID,
            emailAddress: v.emailAddresses[0]['email'],
            displayName: v.givenName + ' ' + v.familyName,
            avatarUrl:
              'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
            statusMessage: 'Test status',
          }));

        contactList.set(newArr);

        let strippedArr = newArr.map(v => ({
          emailAddress: v.emailAddress,
        }));
        SocketService.Send('getContactInfo', strippedArr);
      })
      .catch(e => {
        console.log(e);
      });

    Contacts.getCount().then(count => {
      //console.log('Found ' + count + ' contacts.');
    });

    Contacts.checkPermission();
  };

  const ContactsButton = () => {
    navigation.navigate('Contacts');
  };

  useEffect(() => {
    SocketService.InitSocket();
    SetupSocketEvents();

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        RefreshContacts();
      });
    } else {
      RefreshContacts();
    }
    return () => {
      SocketService.CloseSocket();
    };
  }, []);
  return (
    <SafeAreaView style={styles.Screen}>
      <Button
        title="Add Message"
        onPress={() =>
          HandleMessage({
            entityID: 'louw.mark@yahoo.com',
            message: {
              text: 'Hello there!',
              timestamp: new Date().getTime(),
              senderID: 'louw.mark@yahoo.com',
            },
          })
        }></Button>
      <ScrollView>
        {chats.get().map(({entityID, messages, avatarUrl, chatName}) => (
          <ChatPanel
            key={entityID}
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
