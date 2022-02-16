// instantiate OAuthuClient
require("dotenv").config();
const express = require("express");
const router = express.Router();
// require library
const OAuthClient = require("intuit-oauth");

// Authorization Code flow
// step 1
// instantiate client
const oauthClient = new OAuthClient({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  environment: "sandbox" || "production",
  redirectUri: process.env.REDIRECTURI,
  logging: true,
});

// AuthorizationUri
const authUri = oauthClient.authorizeUri({
  scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.Payment],
  state: "testState",
}); // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}

// Redirect the authUri
res.redirect(authUri);

// step 2
// Parse the redirect URL for authCode and exchange them for tokens
const parseRedirect = req.url;

// Exchange the auth code retrieved from the **req.url** on the redirectUri
oauthClient
  .createToken(parseRedirect)
  .then(function (authResponse) {
    console.log("The Token is  " + JSON.stringify(authResponse.getJson()));
  })
  .catch(function (e) {
    console.error("The error message is :" + e.originalMessage);
    console.error(e.intuit_tid);
  });
// *****************************************************************************
// helper functions to check if the token is valid!!
if (oauthClient.isAccessTokenValid()) {
  console.log("The access_token is valid");
}
// if not valid, then refresh!
if (!oauthClient.isAccessTokenValid()) {
  oauthClient
    .refresh()
    .then(function (authResponse) {
      console.log("Tokens refreshed : " + JSON.stringify(authResponse.json()));
    })
    .catch(function (e) {
      console.error("The error message is :" + e.originalMessage);
      console.error(e.intuit_tid);
    });
}

// Revoke tokens by the following method
oauthClient
  .revoke()
  .then(function (authResponse) {
    console.log("Tokens revoked : " + JSON.stringify(authResponse.getJson()));
  })
  .catch(function (e) {
    console.error("The error message is :" + e.originalMessage);
    console.error(e.intuit_tid);
  });
// ****************************************************************************
// Getting and setting tokens
// To get the tokens
let authToken = oauthClient.getToken().getToken();

`OR`;

let authToken = oauthClient.token.getToken();

// To Set the retrieved tokens explicitly using Token Object but the same instance
oauthClient.setToken(authToken);

OR;

// To set the retrieved tokens using a new client instance
const oauthClient = new OAuthClient({
  clientId: "<Enter your clientId>",
  clientSecret: "<Enter your clientSecret>",
  environment: "sandbox",
  redirectUri: "<http://localhost:8000/callback>",
  token: authToken,
});

/* Sample API CALL
// Body sample from API explorer examples
const body = {
  TrackQtyOnHand: true,
  Name: 'Garden Supplies',
  QtyOnHand: 10,
  InvStartDate: '2015-01-01',
  Type: 'Inventory',
  IncomeAccountRef: {
    name: 'Sales of Product Income',
    value: '79',
  },
  AssetAccountRef: {
    name: 'Inventory Asset',
    value: '81',
  },
  ExpenseAccountRef: {
    name: 'Cost of Goods Sold',
    value: '80',
  },
};

oauthClient
  .makeApiCall({
    url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/1234/item',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(function (response) {
    console.log('The API response is  : ' + response);
  })
  .catch(function (e) {
    console.log('The error is ' + JSON.stringify(e));
  });
  */
