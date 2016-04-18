'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendNewPassword = undefined;

var _mailgunJs = require('mailgun-js');

var _mailgunJs2 = _interopRequireDefault(_mailgunJs);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Email Template
function emailTemplate(name, password) {
  var htmlMsg = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' + '<html xmlns="http://www.w3.org/1999/xhtml">' + '<body>' + '<p>Hey ' + name + ',</p>' + '<p>You requested to reset the password</p>' + '<p>Your new password is:</p>' + '<h4>' + password + '</h4>' + '<br/>' + '<p>All the best,</p>' + '<br />' + '<strong>KickstarterClone Team</strong>' + '</body>' + '</html>';
  return htmlMsg;
}

// Generate random password
function generateNewPassword() {
  var newPassword = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 10; i++) {
    newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return newPassword;
}

var sendNewPassword = exports.sendNewPassword = function sendNewPassword(req, res) {
  var email = req.body.yourEmail;

  var newPassword = generateNewPassword();

  _bcrypt2.default.genSalt(10, function (err, salt) {
    _bcrypt2.default.hash(newPassword, salt, function (err, hashedPassword) {

      var query = { email: email };
      var update = { $set: { password: hashedPassword } };

      _user2.default.findOneAndUpdate(query, update, function (err, user) {
        if (user && email === user.email) {

          var mailgun = new _mailgunJs2.default({
            apiKey: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN
          });

          var data = {
            from: 'KickstarterClone Admin <postmaster@' + process.env.MAILGUN_DOMAIN + '>',
            to: user.email,
            subject: '[KickstarterClone Admin] - Password Reset',
            html: emailTemplate(user.name, newPassword)
          };

          mailgun.messages().send(data, function (error, body) {
            if (error) {
              req.flash('danger', 'Something went wrong...try again');
              return res.redirect('/forgot-password');
            } else {
              req.flash('success', 'Successfully sent to your email');
              return res.redirect('/login');
            }
          });
        } else {
          req.flash('danger', 'No user found with this email');
          return res.redirect('/forgot-password');
        }
      });
    });
  });
};