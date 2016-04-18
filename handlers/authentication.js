'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportConfig = require('../helpers/passport-config');

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _helpers = require('../helpers/helpers');

var _validations = require('../helpers/validations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authHandler = {
  signup: function signup(req, res, next) {
    _async2.default.waterfall([function (callback) {
      // Even though I checked the user inputs in browser,
      // check user inputs again in server
      // because I don't trust users ;)

      var errors = [];

      var checkNameResult = (0, _validations.checkName)(req.body.signupName);
      var checkEmailResult = (0, _validations.checkEmail)(req.body.signupEmail);
      var checkEmailAgainResult = (0, _validations.checkEmailAgain)(req.body.signupEmail, req.body.signupEmailagain);
      var checkPasswordResult = (0, _validations.checkPassword)(req.body.signupPassword);
      var checkPasswordAgainResult = (0, _validations.checkPasswordAgain)(req.body.signupPassword, req.body.signupPasswordagain);

      // Gather all the errors
      if (checkNameResult !== null) {
        errors.push(checkNameResult);
      }
      if (checkEmailResult !== null) {
        errors.push(checkEmailResult);
      }
      if (checkEmailAgainResult !== null) {
        errors.push(checkEmailAgainResult);
      }
      if (checkPasswordResult !== null) {
        errors = errors.concat(checkPasswordResult);
      }
      if (checkPasswordAgainResult !== null) {
        errors.push(checkPasswordAgainResult);
      }

      // If there are any errors, notify them in browser!
      if (errors.length > 0) {
        req.flash('danger', errors);
        return res.redirect('/signup');
      }

      // Create a new User object
      var userObj = new _user2.default({
        name: req.body.signupName,
        email: req.body.signupEmail,
        password: req.body.signupPassword,
        photo: (0, _helpers.getGravatarURL)(req.body.signupEmail)
      });

      // Check if user already exists
      _user2.default.findOne({ email: req.body.signupEmail }, function (err, user) {
        if (err) {
          req.flash('danger', 'Something went wrong. Please try again.');
          return res.redirect('/signup');
        }

        if (user) {
          req.flash('danger', 'Account with the email already exists.');
          return res.redirect('/signup');
        }

        // Save the user into database
        userObj.save(function (saveErr, signUpUser) {
          if (saveErr) {
            console.log('ERR', saveErr);
            req.flash('danger', 'Could not save new user, please try again.');
            return res.redirect('/signup');
          }

          callback(null, signUpUser);
        });
      });
    },

    // Let signup user Login automatically
    function (user) {
      req.logIn(user, function (err) {
        if (err) {
          req.flash('danger', 'Login failed, try to log in again.');
          return res.redirect('/login');
        }

        req.flash('success', 'Signed up & Logged in!');
        return res.redirect('/profile');
      });
    }]);
  },
  logout: function logout(req, res, next) {
    req.logout();
    req.flash('success', 'You are logged out.');
    res.redirect('/login');
  },
  login: function login(req, res) {
    _passport2.default.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res);
  },


  /* >>>>> Passport-OAuth2 attempt >>>>>
  oauthCallBackPassport(req, res) {
    passport.authenticate('provider', { 
      successRedirect: '/profile',
      failureRedirect: '/profile',
      failureFlash: true
    })(req, res);
  },
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

  // Stripe connect authorize
  // https://stripe.com/docs/connect/standalone-accounts
  // i.e. https://gist.github.com/padolsey/7109113
  authorize: function authorize(req, res) {
    // Redirect to Stripe /oauth/authorize endpoint
    res.redirect(process.env.STRIPE_AUTHORIZE_URI + '?' + _querystring2.default.stringify({
      response_type: 'code',
      scope: 'read_write',
      client_id: process.env.STRIPE_CLIENT_ID
    }));
  },
  oauthCallback: function oauthCallback(req, res) {
    var code = req.query.code;
    // Make /oauth/token endpoint POST request
    _request2.default.post({
      url: process.env.STRIPE_TOKEN_URI,
      form: {
        grant_type: 'authorization_code',
        client_id: process.env.STRIPE_CLIENT_ID,
        code: code,
        client_secret: process.env.STRIPE_API_KEY
      }
    }, function (err, r, body) {
      if (err) {
        req.flash('danger', err.error_description);
        return res.redirect('/profile');
      }

      var parsedBody = JSON.parse(body);

      var accessToken = parsedBody.access_token;
      var refreshToken = parsedBody.refresh_token;
      var stripeUserId = parsedBody.stripe_user_id;

      var userObject = {
        stripe: {
          access_token: accessToken,
          refresh_token: refreshToken,
          stripe_user_id: stripeUserId
        }
      };

      // Update the user information (Adding Stripe inofrmation)
      _user2.default.findOneAndUpdate({ _id: req.user._id }, userObject, function (err, user) {
        if (err) {
          req.flash('danger', 'Could not process the authentication. Try again.');
          return res.redirect('/profile');
        } else {
          req.flash('info', 'Successfully authenticated');
          return res.redirect('/create-project');
        }
      });
    });
  }
};

exports.default = authHandler;