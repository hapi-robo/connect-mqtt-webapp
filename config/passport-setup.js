// reference: https://gist.github.com/joshbirk/1732068
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const AzureStrategy = require("passport-azure-ad-oauth2").Strategy;

const keys = require("./keys");
const User = require("../models/User");

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id).then(user => {
    cb(null, user);
  });
});

// local strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, 
    (email, password, cb) => {
    // match user
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          return cb(null, false, { message: "Unregistered email"});
        }

        // match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            return cb(null, user);
          } else {
            return cb(null, false, { message: "Incorrect password" });
          }
        });
      })
      .catch(err => console.log(err));
  })
);

// https://portal.azure.com/
// Home > App registration > Authentication
passport.use(
  new AzureStrategy(
    {
      clientID: keys.azure.clientID,
      clientSecret: keys.azure.clientSecret,
      callbackURL: "/auth/azure/redirect",
      proxy: true // this is needed for deploying to production on heroku (https://stackoverflow.com/a/59450847)
    },
    (accessToken, refreshToken, params, profile, cb) => {
      const waadProfile = jwt.decode(params.id_token);
      // console.log(params);
      console.log(waadProfile);

      // check if user already exists in our db
      User.findOne({ azureId: waadProfile.sub })
        .then(user => {
          if (user) {
            // user already exists
            console.log("User already exists: ", user);
            cb(null, user);
          } else {
            // if not, create user in our db
            // reference: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens
            new User({
              userName: waadProfile.name,
              firstName: waadProfile.given_name,
              lastName: waadProfile.family_name,
              email: waadProfile.upn,
              azureId: waadProfile.sub
              // @TODO: Add locale
            })
              .save()
              .then(newUser => {
                console.log("New user created: ", newUser);
                cb(null, newUser);
              });
          }
        });
    }
  )
);

// https://github.com
// Settings > Developer settings
passport.use(
  new GitHubStrategy(
    {
      clientID: keys.github.clientID,
      clientSecret: keys.github.clientSecret,
      callbackURL: "/auth/github/redirect",
      proxy: true // this is needed for deploying to production on heroku (https://stackoverflow.com/a/59450847)
    },
    (accessToken, refreshToken, profile, cb) => {
      // console.log(profile);

      // check if user already exists in our db
      User.findOne({ githubId: profile.id })
        .then(user => {
          if (user) {
            // user already exists
            console.log("User already exists: ", user);
            cb(null, user);
          } else {
            // if not, create user in our db
            new User({
              username: profile.username,
              githubId: profile.id
              // @TODO: Add locale
            })
              .save()
              .then(newUser => {
                console.log("New user created: ", newUser);
                cb(null, newUser);
              });
          }
        });
    }
  )
);
