require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json"),
});

app.post("/auth", (req, res) => {
  const idToken = req.body.idToken;

  admin
  .auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    console.log(uid + " logged in.");
    res.sendStatus(200)
  })
  .catch((error) => { 
    console.log(error);
    res.sendStatus(401);
  });
});

app.listen(5000, () => console.log("listening on: 5000"));
