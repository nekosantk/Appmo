require("dotenv").config({ path: __dirname + "/.env" });

var express = require("express");
var http = require("http");
var socketio = require("socket.io");

var app = express();
var server = http.Server(app);
var websocket = socketio(server);

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json"),
});

server.listen(process.env.EXPRESS_PORT, () =>
  console.log("listening on: " + process.env.EXPRESS_PORT)
);

// App starts here

var connectedClients = new Map();

var connectCounter = 0;

websocket.on("connection", (socket) => {
  connectCounter++;
  console.log("User connected: " + socket.id + " counter: " + connectCounter);

  socket.on("auth", (message) => {
    onAuth(socket, message);
  });

  socket.on("disconnect", (socket) => {
    onDisconnect(socket);
  });

  socket.on("message", (message) => {
    onMessage(socket, message);
  });

  socket.on("getContactInfo", (message) => {
    onGetContactInfo(socket, message);
  });
});

function onAuth(socket, message) {
  message = message.replace(/\"/g, "");

  admin
    .auth()
    .verifyIdToken(message)
    .then((decodedToken) => {
      var email = decodedToken.email;
      connectedClients.set(email, socket);
      socket.email = email;
      // TODO: Fetch pending user messages from database and mark as sent
    });
}

function onDisconnect(socket) {
  connectCounter--;
  connectedClients.delete()
  console.log("User disconnect: counter: " + connectCounter);
}

function onMessage(socket, message) {
  var destinationID = message.destinationID;
  var senderID = socket.email;
  var messageObj = {
      text: message.text,
      timestamp: new Date().getTime(),
      senderID: senderID,
  };

  /*
  var entityID = message.entityID;
  var text = message.message.text;
  var messageObj = {
    entityID: entityID,
    message: {
      text: text,
      timestamp: new Date().getTime(),
      senderID: entityID,
    },
  };*/

  // Check if user is online
  if (connectedClients.has(destinationID)) {
    // Send to them directly
    connectedClients.get(destinationID).emit("message", messageObj);
  } else {
    // Store in DB if offline
  }
}

function onGetContactInfo(socket, message) {
  //console.log("T: %j", message);
  console.log("Contact info was requsted: " + message);
}
