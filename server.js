require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 9000;
const bodyParser = require("body-parser");
require("./db/db");
const QuickBooks = require("node-quickbooks");
const fetch = require("fetch");

// IMPORT//REQUIRE FOR PREPOPULATING MONGOOSE, RUN ONCE!!
const furnitureDummy = require("./sampleData/furnitureDummy.js");
const Furniture = require("./models/furniture.js");
const mongoose = require("mongoose");

// additional packages - MIDDLEWARE
const session = require("express-session");
const userController = require("./controllers/users");
const furnController = require("./controllers/furnitureController");
const sendgridController = require("./controllers/sendgridController");
const intuitController = require("./controllers/intuitController");

// cors
const whiteList = ["http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
// controllers
app.use("/auth", userController);
app.use("/furn", furnController);
app.use("/sendgrid", sendgridController);
app.use("/intuit", intuitController);
// ******* OAUTH2 Routes *******
/*
                      ENDPOINTS!
url/oa/authUri -- get app info, from dotenv 1                           TESTED!!
url/oa/callback -- handle callback function and get token 2
url/oa/refreshAccessToken -- refreshes access token and returns
url/oa/getCompanyInfo -- show company

*/
// App variables

// ***** ROUTE NOT FOUND *******
app.get("/", (req, res) => {
  try {
    res.send("URI NOT FOUND :)");
  } catch (err) {
    res.status(400).json(err);
  }
});
// ********* Authenticated Middleware *********

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.status(400).json({ error: "error" });
  }
};

// Dummy Data , run once and then comment out
// Furniture.insertMany(furnitureDummy, (err, furn) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log("added provided furniture data", furn);
// });

app.listen(PORT, () => {
  console.log("Now listening on port", PORT);
});
