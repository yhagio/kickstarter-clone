'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthenticated = undefined;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***
 Serialize and deserialize
***/

// Serialize: translate the data structure
// to the format that can be stored in connect-mongo
_passport2.default.serializeUser(function (user, done) {
  done(null, user._id);
});

// Deserialize: retrieve tha data stored by serialization
_passport2.default.deserializeUser(function (id, done) {
  _user2.default.findById(id, function (err, user) {
    if (err) {
      return done(err);
    }
    done(err, user);
  });
});

// Login
_passport2.default.use('local', new _passportLocal.Strategy({
  // Custom
  // Login with email instead of username(default)
  'usernameField': 'loginEmail',
  'passwordField': 'loginPassword',
  'passReqToCallback': true
}, function (req, email, password, done) {

  _user2.default.findOne({ email: email }, function (err, user) {
    // Check if user exists and,
    // Check if user's password is correct (same as the one in DB)
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, req.flash('danger', 'User not found with this email.'));
    }

    if (!user.comparePassword(password)) {
      return done(null, false, req.flash('danger', 'Incorrect password.'));
    }

    return done(null, user);
  });
}));

/* >>>>>>>>>>>>>>>>>  OAuth for project creator >>>>>>>>>>>
import { OAuth2Strategy } from 'passport-oauth';

// http://passportjs.org/docs/oauth
const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID;
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const STRIPE_TOKEN_URI = process.env.STRIPE_TOKEN_URI;
const STRIPE_AUTHORIZE_URI = process.env.STRIPE_AUTHORIZE_URI;

passport.use('provider', new OAuth2Strategy({
    authorizationURL: STRIPE_AUTHORIZE_URI,
    tokenURL: STRIPE_TOKEN_URI,
    clientID: STRIPE_CLIENT_ID,
    clientSecret: STRIPE_API_KEY,
    callbackURL: 'http://192.168.33.10:3000/oauth/callback',
    passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('AccessToken: ', accessToken);
    console.log('RefreshToken: ', refreshToken);
    console.log('Profile: ', profile);
    
    // let userObject = {
    //   stripe: {
    //     access_token: accessToken,
    //     refresh_token: refreshToken,
    //     stripe_user_id: stripeUserId
    //   }
    // };
    
    // // Update the user information (Adding Stripe inofrmation)
    // User.findOneAndUpdate({_id: req.user._id}, userObject, (err, user) => {
    //   if (err) {
    //     req.flash('error', 'Could not process the authentication. Try again.');
    //     return res.redirect('/profile');
    //   } else {
    //     req.flash('info', 'Successfully authenticated');
    //     return res.redirect('/profile');
    //   }
    // });
  }
));
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

// Custom middleware to check if the user is authenticated (logged in)
var isAuthenticated = exports.isAuthenticated = function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};