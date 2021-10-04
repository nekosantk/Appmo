import React, {useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import ContactPanel from '../components/ContactPanel';
import {SafeAreaView} from 'react-native-safe-area-context';
import AddContactPanel from '../components/AddContactPanel';
import AddGroupPanel from '../components/AddGroupPanel';
import Contacts from 'react-native-contacts';
import SocketService from '../SocketService';
import {useState} from '@hookstate/core';
import Store from '../components/Store';

const ContactsView = ({navigation}) => {
  const {contactList} = useState(Store);

  return (
    <SafeAreaView>
      <ScrollView>
        <AddGroupPanel navigation={navigation} />
        <AddContactPanel navigation={navigation} />
        {contactList.get().map(
          ({recordID, displayName, avatarUrl, statusMessage, emailAddress}) => (
            <ContactPanel
              key={recordID}
              entityID={emailAddress}
              chatName={displayName}
              avatarUrl={avatarUrl}
              statusMessage={statusMessage}
              navigation={navigation}
            />
          ),
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactsView;

const styles = StyleSheet.create({});
