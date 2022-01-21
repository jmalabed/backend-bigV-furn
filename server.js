const express = require("express");
const app = express();
const PORT = 3000;

// additional packages - MIDDLEWARE
require("dotenv").config();
const session = require("express-session");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//routes

app.listen(PORT, () => {
  console.log("Now listening on port", PORT);
});
