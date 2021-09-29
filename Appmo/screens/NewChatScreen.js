import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ContactPanel from '../components/ContactPanel';
import {ListItem, Avatar} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';

const NewChat = () => {
  const testList = [
    {
      id: 0,
      displayName: 'Amy Farha',
      avatarUrl: 'https://wallpapercave.com/wp/wp5165982.jpg',
      statusMessage: 'Vice President',
    },
    {
      id: 1,
      displayName: 'Chris Jackson',
      avatarUrl: 'https://wallpapercave.com/wp/wp6409639.jpg',
      statusMessage: 'Vice Chairman',
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView>
        {testList.map(({id, displayName, avatarUrl, statusMessage }) => (
          <ContactPanel
            key={id}
            id={id}
            displayName={displayName}
            avatarUrl={avatarUrl}
            statusMessage={statusMessage}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewChat;

const styles = StyleSheet.create({});
