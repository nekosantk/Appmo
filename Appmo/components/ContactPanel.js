import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';

const ContactPanel = ({navigation, chatName, avatarUrl, statusMessage, entityID}) => {
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
          <ListItem.Subtitle>{statusMessage}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
};

export default ContactPanel;

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
  },
});
