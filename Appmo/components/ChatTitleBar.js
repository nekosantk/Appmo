import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ChatTitleBar = ({entityID, chatName, avatarUrl}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Avatar
        rounded
        source={{
          uri: avatarUrl,
        }}
        style={styles.avatar}
      />
      <Text style={styles.chatName}>{chatName}</Text>
    </View>
  );
};

export default ChatTitleBar;

const styles = StyleSheet.create({
  chatName: {
    fontSize: 18,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});
