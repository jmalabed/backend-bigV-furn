const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { createUserToken, requireToken } = require("../middleware/auth");

//Login Route
router.post("/login", async (req, res, next) => {
  try {
    const loggingUser = req.body.username;
    const foundUser = await User.findOne({ username: loggingUser });
    const token = await createUserToken(req, foundUser);
    res.status(200).json({
      user: foundUser,
      isLoggedIn: true,
      token,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    req.body.password = passwordHash;
    const newUser = await User.create(req.body);
    res.status(201).json({
      currentUser: newUser,
      isLoggedIn: true,
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

const register = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    const pwStore = req.body.password;
    req.body.password = passwordHash;
    const newUser = await User.create(req.body);
    if (newUser) {
      req.body.password = pwStore;
      const authenticatedUserToken = createUserToken(req, newUser);
      res.status(201).json({
        currentUser: newUser,
        isLoggedIn: true,
        token: authenticatedUserToken,
      });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

router.get("/logout", requireToken, async (req, res, next) => {
  try {
    const currentUser = req.user.username;
    delete req.user;
    res.status(200).json({
      mesage: `${currentUser} currently logged in`,
      isLoggedIn: false,
      token: "",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/login", async (req, res) => {
  try {
    const foundUsers = await User.find();
    console.log(foundUsers);
    res.status(200).json(foundUsers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;