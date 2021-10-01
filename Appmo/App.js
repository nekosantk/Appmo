import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ContactsScreen from './screens/ContactsScreen';

export default App = () => {

  const Stack = createNativeStackNavigator();
  const [isSignedIn, setSignedIn] = useState(false);

  function onAuthStateChanged(user) {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={HeaderOptions.HomeOptions} />
            <Stack.Screen name="Contacts" component={ContactsScreen} options={HeaderOptions.ContactsOptions} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={HeaderOptions.LoginOptions}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HeaderOptions = {
  LoginOptions: {
    headerShown: false
  },
  HomeOptions: {
    headerShown: false
  },
  ContactsOptions: {
    title: 'New Chat',
    headerTitleAlign: 'center'
  },
};