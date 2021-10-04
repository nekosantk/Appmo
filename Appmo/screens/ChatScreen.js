import React, {useEffect, useContext} from 'react';
import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import ChatTitleBar from '../components/ChatTitleBar';
import GoBackButton from '../components/GoBackButton';
import Store from '../components/Store';
import { useState } from '@hookstate/core';

const ChatScreen = ({route, navigation}) => {
  const {chats} = useState(Store);
 
  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => <GoBackButton navigation={navigation} />,
      headerRight: null,
      headerTitle: () => (
        <View>
          <ChatTitleBar
            chatID={route.params.chatID}
            chatName={route.params.chatName}
            avatarUrl={route.params.avatarUrl}
          />
        </View>
      ),
    });
    return () => {};
  }, []);

  let isNew = chats.get().find(obj => { return obj.entityID === route.params.entityID;}) !== undefined;

  if (isNew) { 
  return (
    <SafeAreaView style={styles.Screen}>
      <ScrollView>
        {chats
          .get()
          .find(obj => {
            return obj.entityID === route.params.entityID;
          })
          .messages
          .map(({text, senderID, timestamp}) => (
            <Text key={timestamp}>
              {senderID} -{'>'} {text}
            </Text>
          ))}
      </ScrollView>
    </SafeAreaView>
  )}
  else {
    return (
      <SafeAreaView style={styles.Screen}>
      <ScrollView>
      </ScrollView>
    </SafeAreaView>
    );
  }
};

export default ChatScreen;

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
  },
});
