const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  createUserToken,
  requireToken,
  handleValidateOwnership,
} = require("../middleware/auth");

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
router.post("/register", async (req, res, next) => {
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
        user: newUser,
        isLoggedIn: true,
        token: authenticatedUserToken,
      });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.get("/logout", requireToken, async (req, res, next) => {
  try {
    console.log(req);
    const currentUser = req.user.username;
    delete req.user;
    res.status(200).json({
      mesage: `${currentUser} just logged out`,
      isLoggedIn: false,
      token: "",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const editedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(editedUser);
  } catch (err) {
    res.status(400).json({ err: err.message });
  } finally {
  }
});

module.exports = router;
