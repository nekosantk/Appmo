require('dotenv').config({path: __dirname + '/.env'})

const express = require('express');

const app = express();


app.get('/auth', (req, res) => {
    res.send("Hello from server");
    console.log("auth")
});

app.listen(5000, () => console.log('listening on: 5000'));