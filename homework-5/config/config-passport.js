const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
//require("../models/user");
const User = mongoose.model("User");
const secret = require("./config.json").secret;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
  /* jwtFromRequest: req => {
    console.log("req = ", req);
    return null;
  } */
};

passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log("username1 = ", username);
    console.log("password1 = ", password);
    //req.body = JSON.parse(req.body);
    User.findOne({ username })
      .then(user => {
        console.log("user = ", user);
        if (!user) {
          return done(null, false);
        }
        if (!user.validPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch(err => done(err));
  })
);

passport.use(
  new Strategy(params, function(payload, done) {
    console.log("passport strategy");
    User.find({ id: payload.id })
      .then(user => {
        if (!user) {
          return done(new Error("User not found"));
        }
        return done(null, { id: user.id });
      })
      .catch(err => done(err));
  })
);
