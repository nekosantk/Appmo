import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';

const ChatPanel = ({navigation, entityID, chatName, avatarUrl, messages}) => {
  const EnterChat = () => {
    navigation.navigate('Chat', {entityID, chatName, avatarUrl});
  };
  
  return (
    <TouchableOpacity key={entityID} onPress={EnterChat}>
      <ListItem>
        <Avatar
          rounded
          source={{
            uri: avatarUrl,
          }}
          style={styles.avatar}
        />
        <ListItem.Content>
          <ListItem.Title style={{fontWeight: '800'}}>
            {chatName}
          </ListItem.Title>
          <ListItem.Subtitle numberOfLines = { 1 }>{messages[messages.length - 1].text}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
};

export default ChatPanel;

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
  },
});
