require("dotenv").config({ path: __dirname + "/.env" });

var express = require("express");
var http = require("http");
const { Server } = require("socket.io");

var fs = require("fs");
var md5 = require("md5");

var app = express();
var server = http.Server(app);
var websocket = new Server(server, {
  maxHttpBufferSize: 1e8,
});

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

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";

const dbName = "Appmo";
let db;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err);

  // Storing a reference to the database so you can use it later
  db = client.db(dbName);
  console.log(`Connected MongoDB: ${url}`);
  console.log(`Database: ${dbName}`);
});

// App starts here

var connectedClients = new Map();

var connectCounter = 0;

var count = 0;

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

  socket.on("getProfileInfo", (message) => {
    onGetProfileInfo(socket, message);
  });

  socket.on("updateStatusMessage", (message) => {
    onUpdateStatusMessage(socket, message);
  });

  socket.on("updateProfilePicture", (messsage) => {
    onUpdateProfilePicture(socket, messsage);
  });

  socket.on("getPendingMessages", () => {
    onGetPendingMessages(socket);
  });

  socket.on("getMessageStatusUpdate", () => {
    onGetMessageStatusUpdate(socket);
  });
});

async function onGetMessageStatusUpdate(socket) {
  const result = await db
    .collection("Chats")
    .find({ senderID: socket.email })
    .toArray();
  for (let i = 0; i < result.length; i++) {
    dbMessage = result[i];
    var messageObj = {
      senderID: dbMessage.recieverID,
      status: dbMessage.status,
      internalID: dbMessage.internalID,
    };
    socket.emit("messageStatusUpdate", messageObj);
  }

  // Delete chats that have been delivered AND we've notified the sender
  await db
    .collection("Chats")
    .deleteMany({ senderID: socket.email, status: 2 })
}

async function onGetPendingMessages(socket) {
  // Get all pending message from DB
  const result = await db
    .collection("Chats")
    .find({ recieverID: socket.email })
    .toArray();
  for (let i = 0; i < result.length; i++) {
    dbMessage = result[i];
    var messageObj = {
      text: dbMessage.text,
      timestamp: dbMessage.timestamp,
      senderID: dbMessage.senderID,
    };
    socket.emit("message", messageObj);

    // Set status to delivered (1)
    await db
      .collection("Chats")
      .updateMany({ recieverID: socket.email }, { $set: { status: 1 } });
  }
}

async function onUpdateProfilePicture(socket, message) {
  const [deletePicturePromise, updatePicturePromise] = await Promise.all([
    DeleteProfilePicture(),
    UpdateProfilePicture(),
  ]);
  async function DeleteProfilePicture() {
    var result = await db
      .collection("UserInformation")
      .find({ email: socket.email })
      .toArray();
    if (result.length != 0) {
      fs.unlink(
        "./public/profile_pictures/" + result[0].profilePicture,
        function (err, result) {
          if (err) console.log("error", err);
        }
      );
    }
  }

  async function UpdateProfilePicture() {
    var timestamp = new Date().getTime();
    var fileName = md5(socket.email) + "_" + timestamp + ".png";
    var buff = new Buffer(message, "base64");
    fs.writeFileSync(
      "./public/profile_pictures/" + fileName,
      buff,
      function (err, result) {
        if (err) console.log("error", err);
      }
    );

    await db
      .collection("UserInformation")
      .updateOne(
        { email: socket.email },
        { $set: { profilePicture: fileName } }
      );
    console.log("Updated " + socket.email + " profilePicture to " + fileName);
  }
}

function onAuth(socket, message) {
  message = message.replace(/\"/g, "");

  admin
    .auth()
    .verifyIdToken(message)
    .then((decodedToken) => {
      var email = decodedToken.email;
      connectedClients.set(email, socket);
      socket.email = email;
    });
}

function onDisconnect(socket) {
  connectCounter--;
  connectedClients.delete();
  console.log("User disconnect: counter: " + connectCounter);
}

async function onMessage(socket, message) {
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
    await db.collection("Chats").insertOne({
      recieverID: destinationID,
      senderID: messageObj.senderID,
      text: messageObj.text,
      timestamp: messageObj.timestamp,
      status: 1,
      internalID: message.internalID,
    });
  }
}

async function onUpdateStatusMessage(socket, message) {
  await db
    .collection("UserInformation")
    .updateOne({ email: socket.email }, { $set: { statusMessage: message } });
  console.log("Updated " + socket.email + " status to " + message);
}

async function onGetContactInfo(socket, message) {
  var emails = [];

  for (let i = 0; i < message.length; i++) {
    var email = message[i].emailAddress.replace(/\"/g, "");
    emails.push(email);
  }

  const result = await db
    .collection("UserInformation")
    .find({ email: { $in: emails } })
    .toArray();
  socket.emit("contactData", result);
}

async function onGetProfileInfo(socket, message) {
  const result = await db
    .collection("UserInformation")
    .find({ email: message.replace(/\"/g, "") })
    .toArray();
  socket.emit("profileData", result[0]);
}
