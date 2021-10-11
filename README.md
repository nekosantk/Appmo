# Appmo
 Appmo Chat App project that aims to clone many of the standard features of a modern mobile chat app + backend.
 
 # Stack
 React Native
 NodeJS w/ Express
 MongoDB
 Socket.io
 Various libraries (hookstate, firebase, async-storage, react-native-image-picker, react-native-contacts, md5-hash)
 
 # Features
 Realtime messages
 Profile picture upload
 Status message on profile
 Sent + delivered message states
 Local storage of profile/chats/contacts
 Android permission requests
 Buffering of messages when user is offline
 Auto-fetching of latest contact data
 Auto-sorting as new messages are recieved
 Firebase Authentication (Google Signin)
 Firebase Admin SDK (Verifying users with token)
 
 # Installaton
 cd Appmo
 yarn install
 npx react-native run-android
 
 cd Backend
 npm install
 nodemon
 
 # TODO
 Images in messages
 Voice + video calls with WebRTC
