const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "string";

const { Strategy, ExtractJwt } = require("passport-jwt");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

const User = require("../models/user");

const strategy = new Strategy(opts, function (jwt_payload, done) {
  User.findById(jwt_payload.id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

passport.use(strategy);

passport.initialize();

const requireToken = passport.authenticate("jwt", { session: false });

const createUserToken = (req, user) => {
  if (
    !user ||
    !req.body.password ||
    !bcrypt.compareSync(req.body.password, user.password)
  ) {
    const err = new Error("The provided username or password is incorrect");
    err.statusCode = 422;
    throw err;
  }
  return jwt.sign({ id: user._id }, secret, { expiresIn: 36000 });
};

const handleValidateOwnership = (req, document) => {
  const ownerId = document.owner._id || document.owner;
  if (!req.user._id.equals(ownerId)) {
    return new Error("Unauthorized Access");
  } else {
    return document;
  }
};

module.exports = {
  requireToken,
  createUserToken,
};
