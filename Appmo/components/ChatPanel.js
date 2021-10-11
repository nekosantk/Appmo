import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import auth from '@react-native-firebase/auth';

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
          <View style={styles.messagePreview}>
            {messages[messages.length - 1].senderID ===
            auth().currentUser.email ? (
              <>
                {messages[messages.length - 1].status == 0 ? (
                  <>
                    <Octicons name="clock" size={15} color="black" style={{marginRight: 5, marginTop: 2}} />
                  </>
                ) : (
                  <>
                    {messages[messages.length - 1].status == 1 ? (
                      <>
                        <Ionicons name="checkmark" size={15} color="black" />
                      </>
                    ) : (
                      <>
                        <Ionicons
                          name="checkmark-done"
                          size={15}
                          color="black"
                        />
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <></>
            )}

            <ListItem.Subtitle numberOfLines={1}>
              {messages[messages.length - 1].text}
            </ListItem.Subtitle>
          </View>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
};

export default ChatPanel;

const styles = StyleSheet.create({
  messagePreview: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
  },
});
