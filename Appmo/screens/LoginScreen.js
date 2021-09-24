import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {StyleSheet, View, Text} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {
  REACT_APP_FIREBASE_GOOGLE_KEY,
  REACT_APP_BACKEND_BASEURL,
  REACT_APP_BACKEND_AUTH,
} from '@env';

const LoginScreen = () => {
  const [initializing, setInitializing] = useState(true);

  GoogleSignin.configure({
    webClientId: REACT_APP_FIREBASE_GOOGLE_KEY,
  });

  async function SignInGoogle() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  async function SignInGoogleBackend() {
    auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        var response = fetch(
          REACT_APP_BACKEND_BASEURL + REACT_APP_BACKEND_AUTH,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: idToken,
            }),
          }
        )
        console.log('Reponse: ' + response.ok);
      })
      .catch(function (error) { console.log(error); });
  }

  console.log('BaseURL: ' + REACT_APP_BACKEND_BASEURL + REACT_APP_BACKEND_AUTH);

  function onAuthStateChanged(user) {
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
        onPress={() => {
          SignInGoogle().then(value => {
            SignInGoogleBackend();
          });
        }}
        disabled={initializing}
      />
    </View>
  );
};

/* onPress={() => SignInGoogle().then(() => SignInGoogleBackend() )} */

export default LoginScreen;

const styles = StyleSheet.create({});
