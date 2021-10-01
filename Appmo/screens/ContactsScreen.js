import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import ContactPanel from '../components/ContactPanel';
import {ListItem, Avatar} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import AddContactPanel from '../components/AddContactPanel';
import AddGroupPanel from '../components/AddGroupPanel';
import Contacts from 'react-native-contacts';

const ContactsView = ({ navigation }) => {

  const [contactList, setContactList] = useState([]);
  function loadContacts() {
    Contacts.getAll()
      .then(contacts => {
        setContactList(contacts);
      })
      .catch(e => {
        console.log(e);
      });

      Contacts.getCount().then(count => {
        console.log("Found " + count + " contacts.");
    });

    Contacts.checkPermission();
  }

  useEffect(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts."
      }).then(() => {
        loadContacts();
      });
    } else {
      loadContacts();
    }
    return () => {
      
    }
  }, [])

  const contactList_TEMP = [
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
      <AddGroupPanel navigation={navigation}/>
      <AddContactPanel navigation={navigation}/>
        {contactList.filter(contact => contact.emailAddresses.length != 0).map(({recordID, givenName, familyName, emailAddresses }) => (
          <ContactPanel
            key={recordID}
            id={recordID}
            displayName={givenName + " " + familyName}
            statusMessage={emailAddresses}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactsView;

const styles = StyleSheet.create({});
