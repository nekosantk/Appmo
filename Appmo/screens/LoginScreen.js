import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {StyleSheet, View, Text} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { REACT_APP_FIREBASE_GOOGLE_KEY } from '@env'

const LoginScreen = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId:
    REACT_APP_FIREBASE_GOOGLE_KEY,
  });

  async function SignInGoogle() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}> 
    <Text>Weclome</Text>      
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={SignInGoogle}
        disabled={initializing}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
