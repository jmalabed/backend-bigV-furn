// connected to intuit-oauth API
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// App variables
let oauth2_token_json = null;
let redirectUri = "http://localhost:9000/callback";

// instantiate new client
const OAuthClient = require("intuit-oauth");

let oauthClient = null;

/*
                      ENDPOINTS!
url/oa/authUri -- get app info, from dotenv 1                           TESTED!!
url/oa/callback -- handle callback function and get token 2
url/oa/refreshAccessToken -- refreshes access token and returns
url/oa/getCompanyInfo -- show company
url/oa/disconnect -- disconnect 3

*/

// get the authorizeUri
router.get("/authUri", urlencodedParser, async (req, res) => {
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
router.get("/callback", async (req, res) => {
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

router.get("/retrieveToken", function (req, res) {
  res.status(200).send(oauth2_token_json);
});

// refresh access token -- response of res.send needs to be updated
router.get("/refreshAccessToken", function (req, res) {
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
router.get("/getCompanyInfo", function (req, res) {
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

// disconnect
router.get("/disconnect", function (req, res) {
  console.log("The disconnect called ");
  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
    state: "intuit-test",
  });
  res.status(200).json({ message: "disconnected jm test" });
});

module.exports = router;
