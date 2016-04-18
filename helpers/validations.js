'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
////////////////////////////////////////////////////
////////// Validations of Signup / Profile Update Form /////////////
////////////////////////////////////////////////////

// Check Name
var checkName = exports.checkName = function checkName(name) {
  var errorMsg = "";
  var trimmedName = name.trim();

  if (trimmedName.length < 1) {
    errorMsg += 'Name required';
  }

  if (trimmedName.length > 30) {
    errorMsg += 'Name should be shorter than 30';
  }

  if (errorMsg.length > 0) {
    return errorMsg;
  }
  return null;
};

// Check Email
var checkEmail = exports.checkEmail = function checkEmail(email) {
  var errorMsg = "";
  var trimmedEmail = email.trim();

  if (!email.match(/^\S+@\S+\.\S+$/)) {
    errorMsg += "Email must be in valid format";
  }

  if (errorMsg.length > 0) {
    return errorMsg;
  }
  return null;
};

// Check email confirmation
var checkEmailAgain = exports.checkEmailAgain = function checkEmailAgain(email, emailAgain) {
  var errorMsg = "";
  var trimmedEmail = email.trim();
  var trimmedEmailAgain = emailAgain.trim();

  if (email !== emailAgain) {
    errorMsg = "Email confirmation doesn't match Email";
  }

  if (errorMsg.length > 0) {
    return errorMsg;
  }
  return null;
};

// Check Password
var checkPassword = exports.checkPassword = function checkPassword(password) {
  var errors = [];
  var trimmedPassword = password.trim();

  if (trimmedPassword.length > 30) {
    errors.push("Password must be less than 31 chars");
  }

  if (trimmedPassword.length < 8) {
    errors.push("Password must be longer than 7 chars");
  }

  if (!trimmedPassword.match(/\d/g)) {
    errors.push("Password needs a number");
  }

  if (!trimmedPassword.match(/[a-z]/g)) {
    errors.push("Password needs a lowercase letter");
  }

  if (!trimmedPassword.match(/[A-Z]/g)) {
    errors.push("Password needs an uppercase letter");
  }

  if (errors.length > 0) {
    return errors;
  }
  return null;
};

// Check Password Confirmation
var checkPasswordAgain = exports.checkPasswordAgain = function checkPasswordAgain(password, passwordAgain) {
  var errorMsg = "";
  var trimmedPassword = password.trim();
  var trimmedPasswordAgain = passwordAgain.trim();

  if (trimmedPassword !== trimmedPasswordAgain) {
    errorMsg = "Password confirmation doesn't match Password";
  }

  if (errorMsg.length > 0) {
    return errorMsg;
  }
  return null;
};

////////////////////////////////////////////////////
/////// Validations of Project Creation Form ///////
////////////////////////////////////////////////////

// checkFundingGoal
var checkFundingGoal = exports.checkFundingGoal = function checkFundingGoal(goal) {
  if (goal.length <= 0) {
    return 'Funding goal is required';
  }

  var intGoal = parseInt(goal);

  if (isNaN(intGoal) === true) {
    return 'Funding goal must be number.';
  }

  if (intGoal <= 0) {
    return 'Funding goal must be greater then 0.';
  }

  return null;
};

// checkFundingEndDate
var checkFundingEndDate = exports.checkFundingEndDate = function checkFundingEndDate(end_date) {
  if (end_date < new Date()) {
    return 'Funding end date must be later than today.';
  }

  return null;
};

// checkEstimatedDelivery
var checkEstimatedDelivery = exports.checkEstimatedDelivery = function checkEstimatedDelivery(estimate_date) {
  if (estimate_date < new Date()) {
    return 'Estimate Delivery date must be later than today.';
  }

  return null;
};

// checkLocation
var checkLocation = exports.checkLocation = function checkLocation(location) {
  if (isNaN(parseInt(location)) === false) {
    return 'Location name cannot be number';
  }

  if (location.length <= 0) {
    return 'Location name is required';
  }

  if (location.length > 30) {
    return 'Location name is too long';
  }

  return null;
};

// check if the string exceeds the limit
// can be empty
var checkStrLength = exports.checkStrLength = function checkStrLength(text, limit, subject) {
  var errorMessage = '';
  if (text.trim().length > limit) {
    errorMessage = subject + ' cannot be longer then ' + limit + ' characters.';
  } else {
    errorMessage = null;
  }
  return errorMessage;
};