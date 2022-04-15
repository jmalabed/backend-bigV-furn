require("dotenv").config();

const express = require("express");

const OAuthClient = require("intuit-oauth");

const router = express.Router();

// part 1
const oauthClient = new OAuthClient({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  environment: "sandbox",
  redirectUri: `http://localhost:9000/intuit/callback`,
});

let authUri = null;

router.get("/getToken", async (req, res) => {
  authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.Payment],
    state: "testState",
  });
  res.redirect(authUri);
});
// part 2
router.get("/callback", async (req, res) => {
  // Parse the redirect URL for authCode and exchange them for tokens
  const parseRedirect = req.url;
  // Exchange the auth code retrieved from the **req.url** on the redirectUri
  try {
    const token = await oauthClient.createToken(parseRedirect);
    res.status(200).json(token.json);
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
