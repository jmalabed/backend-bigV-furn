const sgMail = require("@sendgrid/mail");
const express = require("express");
const router = express.Router();
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "jmalabed27@gmail.com", // Change to your recipient
  from: "jmalabed27@gmail.com", // Change to your verified sender
  subject: "Test email from yourself!",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

router.post("/", async (req, res, next) => {
  sgMail
    .send(msg)
    .then(() => {
      console.log("emailsent");
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

module.exports = router;
