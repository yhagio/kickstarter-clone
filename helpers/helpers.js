'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkURL = checkURL;
exports.isLoggedIn = isLoggedIn;
exports.connectOAuthed = connectOAuthed;
exports.isOauthed = isOauthed;
exports.getDayTilEnd = getDayTilEnd;
exports.prettyDate = prettyDate;
exports.getFundingPercentage = getFundingPercentage;
exports.validateStringLength = validateStringLength;
exports.getGravatarURL = getGravatarURL;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Check URL
function checkURL(url) {
  if (/^(http|https)?:\/\//.test(url)) {
    return url;
  }
  return 'https://' + url;
}

// Check if user is logged in
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/projects');
}

// Check if user is authenticated through Stripe
function connectOAuthed(req, res, next) {
  if (req.user && req.user.stripe.access_token) {
    return next();
  }
  return res.redirect('/profile');
}

// Check if user has connected to Stripe connect
function isOauthed(user) {
  if (user.stripe.access_token) {
    return true;
  }
  return false;
}

// Calculate the day until it expires
function getDayTilEnd(endDate) {
  var timeDiff = new Date(endDate).getTime() - new Date().getTime();

  if (timeDiff <= 0) {
    return '0 seconds';
  }

  var day = timeDiff / (1000 * 3600 * 24);

  if (day >= 2) {
    return parseInt(day) + ' days';
  }

  if (day < 1) {
    // in hours

    var hours = timeDiff / (60 * 60 * 1000);

    if (hours < 1) {
      return parseInt(timeDiff / (60 * 1000)) + ' minutes';
    }

    if (hours >= 2) {
      return parseInt(hours) + ' hours';
    }

    return '1 hour';
  }

  return '1 day';
}

function prettyDate(date) {
  return (0, _moment2.default)(date).fromNow();
  // return moment(date).format('MMMM Do YYYY, h:mm:ss a');
}

// Calculate percentage of funding backed
function getFundingPercentage(goal$, current$) {
  if (current$ == 0) {
    return 0;
  }
  return Math.floor(current$ / goal$ * 100);
}

// Check String length
function validateStringLength(text, limit, subject) {
  var errorMessage = '';
  if (text.trim().length > limit) {
    errorMessage = subject + ' cannot be more than ' + limit + ' characters.';
  } else if (text.trim().length <= 0) {
    errorMessage = subject + ' cannot be empty.';
  } else {
    errorMessage = null;
  }
  return errorMessage;
}

function getGravatarURL(email) {
  var size = arguments.length <= 1 || arguments[1] === undefined ? 200 : arguments[1];

  var md5 = _crypto2.default.createHash('md5').update(email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}