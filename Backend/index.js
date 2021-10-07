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

app.use(express.static("public"));

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json"),
});

server.listen(process.env.EXPRESS_PORT, () =>
  console.log("Listening on: " + process.env.EXPRESS_PORT)
);

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const dbName = 'Appmo'
let db;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)

  // Storing a reference to the database so you can use it later
  db = client.db(dbName)
  console.log(`Connected MongoDB: ${url}`)
  console.log(`Database: ${dbName}`)
})

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
  connectedClients.delete();
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

  // Check if user is online
  if (connectedClients.has(destinationID)) {
    // Send to them directly
    connectedClients.get(destinationID).emit("message", messageObj);
  } else {
    // Store in DB if offline
  }
}

function onGetContactInfo(socket, message) {
  //console.log("Contact info was requsted: %j", message);

  var emails = [];

  for (let i = 0; i < message.length; i++) {
    var email = message[i].emailAddress.replace(/\"/g, "");
    emails.push(email,);
  }
  
  GetUserInformation(emails, socket);
}

async function GetUserInformation(emails, socket)
{
  const result = await db.collection('UserInformation').find({ email: { $in: emails }}).toArray();
  socket.emit("contactData", result);
}
