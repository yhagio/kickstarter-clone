'use strict';

// Reset innerHTML value of an element
function resetInnerHTML(elementID){
  return document.getElementById(elementID).innerHTML = "";
}

// Check Name
function checkName(e){

  var name = document.getElementById('signupName').value.trim();
  var errorMsg = "";

  if(name.length < 1) {
    errorMsg += 'Name required';
  }

  if(name.length > 30){
    errorMsg += 'Name should be shorter than 30';
  }

  if(errorMsg.length > 0){
    if(e){
      e.preventDefault();
    }

    return errorMsg;
  }
  return null;
}

// Validate Email
function checkEmail(e){
  // var email = "";

  var email = document.getElementById('signupEmail').value.trim();

  // resetInnerHTML('errEmail');
  var errorMsg = "";

  if (!email.match(/^\S+@\S+\.\S+$/)) {
    errorMsg += "Email must be in valid format";
  }

  if (errorMsg.length > 0) {
    if(e){
      e.preventDefault();
    }
    return errorMsg;
  }
  return null;
}

// validate email confirmation
function checkEmailAgain(e) {
  var errorMsg = "";
  var email = document.getElementById('signupEmail').value.trim();
  var emailAgain = document.getElementById('signupEmailagain').value.trim();

  if (email !== emailAgain) {
    errorMsg = "Email confirmation doesn't match Email";
  }
  
  if (errorMsg.length > 0) {
    if(e){
      e.preventDefault();
    }
    return errorMsg;
  }
  return null;
}

// Check Password
function checkPassword(e) {
  var password = document.getElementById('signupPassword').value.trim();

  var errors = [];

  if (password.length > 30) {
    errors.push("Password must be less than 31 chars");
  }

  if (password.length < 8) {
    errors.push("Password must be longer than 7 chars");
  }

  if (!password.match(/\d/g)) {
    errors.push("Password needs a number");
  }

  if (!password.match(/[a-z]/g)) {
    errors.push("Password needs a lowercase letter");
  }

  if (!password.match(/[A-Z]/g)) {
    errors.push("Password needs an uppercase letter");
  }

  if (errors.length > 0) {
    if(e){
      e.preventDefault();
    }
    return errors;
  }
  return null;
}

function checkPasswordAgain(e) {
  var errorMsg = "";
  var password = document.getElementById('signupPassword').value.trim();
  var passwordAgain = document.getElementById('signupPasswordagain').value.trim();

  if (password !== passwordAgain) {
    errorMsg = "Password confirmation doesn't match Password";
  }
  
  if (errorMsg.length > 0) {
    if(e){
      e.preventDefault();
    }
    return errorMsg;
  }
  return null;
}

document.getElementById('signup-form').addEventListener('submit', function(e) {
  
  resetInnerHTML('signup-errors-list');

  var errors = [];

  var checkNameResult = checkName(e);
  var checkEmailResult = checkEmail(e);
  var checkEmailAgainResult = checkEmailAgain(e);
  var checkPasswordResult = checkPassword(e);
  var checkPasswordAgainResult = checkPasswordAgain(e);

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

  if (errors.length > 0) {
    document.getElementById('signup-errors-box').className += ' show';
  }

  // Display the errors

  var errorList = document.getElementById('signup-errors-list');
  for (var i = 0; errors.length > i; i++) {
    var li = document.createElement("li");
    var errorText = document.createTextNode(errors[i]);
    li.appendChild(errorText);
    errorList.appendChild(li);
  }

}, false);