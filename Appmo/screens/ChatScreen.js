import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ChatTitleBar from '../components/ChatTitleBar';
import GoBackButton from '../components/GoBackButton';
import Store from '../components/Store';
import {useState} from '@hookstate/core';
import {useState as useStateLocal} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SocketService from '../SocketService';
import auth from '@react-native-firebase/auth';
import ChatBubble from '../components/ChatBubble';

const ChatScreen = ({route, navigation}) => {
  const {chats, contactList} = useState(Store);
  const [input, setInput] = useStateLocal('');
  const [myID, setMyID] = useStateLocal('');

  const SendMessage = () => {
    if (input == '') {
      return;
    }

    var messageObj = {
      destinationID: route.params.entityID,
      text: input,
    };
    SocketService.Send('message', messageObj);

    // Add message to local stack
    var chatStack = chats.get();
    var contactStack = contactList.get();

    // Get chat specific info
    var entityStack = chatStack.find(obj => {
      return obj.entityID === route.params.entityID;
    });

    // Get contact name
    var entityContact = contactStack.find(obj => {
      return obj.emailAddress === route.params.entityID;
    });

    // Set message variables
    var entityID = route.params.entityID;
    var chatName = entityContact
      ? entityContact.displayName
      : 'NoName: ' + entityID; // Get from contact list TODO: store contactList in global state
    var avatarUrl =
      'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'; // Placeholder until we fetch real profile picture
    var newMessage = {
      text: input,
      timestamp: new Date().getTime(),
      senderID: auth().currentUser.email,
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
        avatarUrl: avatarUrl,
        messages: [...p.messages, newMessage],
      }));
    }

    setInput('');
  };

  useEffect(() => {
    setMyID(auth().currentUser.email);
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => <GoBackButton navigation={navigation} />,
      headerRight: null,
      headerTitle: () => (
        <View>
          <ChatTitleBar
            entityID={route.params.entityID}
            chatName={route.params.chatName}
            avatarUrl={route.params.avatarUrl}
          />
        </View>
      ),
    });
    return () => {};
  }, []);

  let isNew =
    chats.get().find(obj => {
      return obj.entityID === route.params.entityID;
    }) !== undefined;

  if (isNew) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView>
          {chats
            .get()
            .find(obj => {
              return obj.entityID === route.params.entityID;
            })
            .messages.map(({text, senderID, timestamp}) => (
              <ChatBubble 
              key={timestamp}
              text={text}
              senderID={senderID}
              timeStamp={timestamp}
              myID={myID}
              />
            ))}
        </ScrollView>
        <View style={styles.bottomBar}>
          <TextInput
            style={styles.input}
            onChangeText={text => setInput(text)}
            value={input}
          />
          <TouchableOpacity onPress={SendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView></ScrollView>
        <View style={styles.bottomBar}>
          <TextInput
            style={styles.input}
            onChangeText={text => setInput(text)}
            value={input}
          />
          <TouchableOpacity onPress={SendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

export default ChatScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#99AAAB',
    width: '80%',
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  sendButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginBottom: 10,
    backgroundColor: '#99AAAB',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  bottomBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
