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

var connectCounter = 0;

websocket.on("connection", (socket) => {
  connectCounter++;
  console.log("User connected: " + socket.id + " counter: " + connectCounter);

  socket.on("disconnect", (socket) => {
    connectCounter--;
    console.log("User disconnect: counter: " + connectCounter);
  });

  socket.on("message", (message) => {
    console.log("New message: " + message);
  });
});

// app.post("/auth", (req, res) => {
//   const idToken = req.body.idToken;

//   admin
//   .auth()
//   .verifyIdToken(idToken)
//   .then((decodedToken) => {
//     const uid = decodedToken.uid;
//     console.log(uid + " logged in.");
//     res.sendStatus(200)
//   })
//   .catch((error) => {
//     console.log(error);
//     res.sendStatus(401);
//   });
// });
