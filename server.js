require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 9000;
const bodyParser = require("body-parser");
require("./db/db");

// IMPORT//REQUIRE FOR PREPOPULATING MONGOOSE, RUN ONCE!!
const furnitureDummy = require("./sampleData/furnitureDummy.js");
const Furniture = require("./models/furniture.js");
const mongoose = require("mongoose");

// additional packages - MIDDLEWARE
const session = require("express-session");
const userController = require("./controllers/users");
const furnController = require("./controllers/furnitureController");

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

// ******* OAUTH2 Routes *******
/*
                      ENDPOINTS!
url/oa/authUri -- get app info, from dotenv 1                           TESTED!!
url/oa/callback -- handle callback function and get token 2
url/oa/refreshAccessToken -- refreshes access token and returns
url/oa/getCompanyInfo -- show company

*/
// App variables
let oauth2_token_json = null;
let redirectUri = "http://localhost:9000/callback";
const urlencodedParser = bodyParser.urlencoded({ extended: false });
// instantiate new client
const OAuthClient = require("intuit-oauth");

let oauthClient = null;
// Routes
// get the authorizeUri
app.get("/authUri", urlencodedParser, async (req, res) => {
  try {
    oauthClient = new OAuthClient({
      clientId: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      environment: "sandbox",
      redirectUri: redirectUri,
    });
    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.payment],
      state: "intuit-test",
    });
    res.status(200).json(authUri);
  } catch (err) {
    res.status(400).json(err);
  }
});

//handle callback function -- req.url needs to be updated
app.get("/callback", async (req, res) => {
  oauthClient
    .createToken(req.url)
    .then(function (authResponse) {
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
    })
    .catch(function (e) {
      res.status(400).json(e);
    });

  res.status(200).json("");
});

app.get("/retrieveToken", function (req, res) {
  res.status(200).send(oauth2_token_json);
});

// refresh access token -- response of res.send needs to be updated
app.get("/refreshAccessToken", function (req, res) {
  oauthClient
    .refresh()
    .then(function (authResponse) {
      console.log(
        `The Refresh Token is  ${JSON.stringify(authResponse.getJson())}`
      );
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      res.status(200).json(oauth2_token_json);
    })
    .catch(function (e) {
      res.status(400).json({ error: e });
    });
});

// get companyinfo
app.get("/getCompanyInfo", function (req, res) {
  const companyID = oauthClient.getToken().realmId;

  const url =
    oauthClient.environment == "sandbox"
      ? OAuthClient.environment.sandbox
      : OAuthClient.environment.production;

  oauthClient
    .makeApiCall({
      url: `${url}v3/company/${companyID}/companyinfo/${companyID}`,
    })
    .then(function (authResponse) {
      console.log(
        `The response for API call is :${JSON.stringify(authResponse)}`
      );
      res.status(200).json(authResponse.text());
    })
    .catch(function (e) {
      res.status(400).json({ error: e });
    });
});

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
Furniture.insertMany(furnitureDummy, (err, furn) => {
  if (err) {
    console.log(err);
  }
  console.log("added provided furniture data", furn);
});

app.listen(PORT, () => {
  console.log("Now listening on port", PORT);
});
