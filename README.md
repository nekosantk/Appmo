# Appmo
 Appmo Chat App project that aims to clone many of the standard features of a modern mobile chat app + backend.
 
 # Stack
 React Native<br>
 Firebase<br>
 NodeJS w/ Express<br>
 MongoDB<br>
 Socket.io<br>
 Various libraries (hookstate, firebase, async-storage, react-native-image-picker, react-native-contacts, md5-hash)<br>
 
 # Features
 Realtime messages<br>
 Profile picture upload<br>
 Status message on profile<br>
 Sent + delivered message states<br>
 Local storage of profile/chats/contacts<br>
 Android permission requests<br>
 Buffering of messages when user is offline<br>
 Auto-fetching of latest contact data<br>
 Auto-sorting as new messages are recieved<br>
 Firebase Authentication (Google Signin)<br>
 Firebase Admin SDK (Verifying users with token)<br>
 All API Keys stored in .env files
 
 # Installation
 Go to Firebase > New Project > Android Project > 
 
 cd Appmo<br>
 yarn install<br>
 npx react-native run-android<br>
 
 cd Backend<br>
 npm install<br>
 nodemon<br>
 
 # TODO
 Images in messages<br>
 Voice + video calls with WebRTC<br>
