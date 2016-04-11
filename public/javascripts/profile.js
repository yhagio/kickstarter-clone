'use strict';

// Check profile fields when updaing profile
if (window.location.pathname === '/profile/edit') {

  document.getElementById('profileUpdateForm').addEventListener('submit', function(e) {
    
    resetInnerHTML('profile-errors-list');

    var errors = [];

    var checkProfileNameResult = checkStrLength(e, 'Name', 50, 'profileName', true);;
    var checkProfileBioResult = checkStrLength(e, 'Biography', 300, 'bio', false);;
    var checkProfileWebsiteResult = checkStrLength(e, 'Webiste', 120, 'profileWebsite', false);;
    var checkProfileLocationResult = checkStrLength(e, 'Location', 40, 'profileLocation', false);;

    // Gather all the errors
    if (checkProfileNameResult !== null) {
      errors.push(checkProfileNameResult);
    }
    if (checkProfileBioResult !== null) {
      errors.push(checkProfileBioResult);
    }
    if (checkProfileWebsiteResult !== null) {
      errors.push(checkProfileWebsiteResult);
    }
    if (checkProfileLocationResult !== null) {
      errors = errors.concat(checkProfileLocationResult);
    }
    
    if (errors.length > 0) {
      document.getElementById('profile-errors-box').className += ' show';
      window.scrollTo(0, 0);
    }

    // Display the errors
    var errorList = document.getElementById('profile-errors-list');
    for (var i = 0; errors.length > i; i++) {
      var li = document.createElement("li");
      var errorText = document.createTextNode(errors[i]);
      li.appendChild(errorText);
      errorList.appendChild(li);
    }

  }, false);
}

// Check email fields when updaing email
if (window.location.pathname === '/profile/edit') {

  document.getElementById('emailUpdateForm').addEventListener('submit', function(e) {
    
    resetInnerHTML('profile-email-errors-list');

    var errors = [];

    var checkEmailResult = checkEmail(e, 'profileEmail');
    var checkEmailAgainResult = checkEmailAgain(e, 'profileEmail', 'profileEmailagain');

    // Gather all the errors
    if (checkEmailResult !== null) {
      errors.push(checkEmailResult);
    }
    if (checkEmailAgainResult !== null) {
      errors.push(checkEmailAgainResult);
    }

    if (errors.length > 0) {
      document.getElementById('profile-email-errors-box').className += ' show';
      // window.scrollTo(0, 0);
    }

    // Display the errors
    var errorList = document.getElementById('profile-email-errors-list');
    for (var i = 0; errors.length > i; i++) {
      var li = document.createElement("li");
      var errorText = document.createTextNode(errors[i]);
      li.appendChild(errorText);
      errorList.appendChild(li);
    }

  }, false);
}

// Check password fields when updaing password
if (window.location.pathname === '/profile/edit') {

  document.getElementById('passwordUpdateForm').addEventListener('submit', function(e) {
    
    resetInnerHTML('profile-password-errors-list');

    var errors = [];
    
    var currentPasswordResult = checkStrLength(e, 'Current Password', 25, 'profileCurrentPassword', true);
    var checkpasswordResult = checkPassword(e, 'profileNewPassword');
    var checkpasswordAgainResult = checkPasswordAgain(e, 'profileNewPassword', 'profilePasswordagain');

    // Gather all the errors
    if (currentPasswordResult !== null) {
      errors.push(currentPasswordResult);
    }
    if (checkpasswordResult !== null) {
      errors = errors.concat(checkpasswordResult);
    }
    if (checkpasswordAgainResult !== null) {
      errors.push(checkpasswordAgainResult);
    }

    if (errors.length > 0) {
      document.getElementById('profile-password-errors-box').className += ' show';
      // window.scrollTo(0, 0);
    }

    // Display the errors
    var errorList = document.getElementById('profile-password-errors-list');
    for (var i = 0; errors.length > i; i++) {
      var li = document.createElement("li");
      var errorText = document.createTextNode(errors[i]);
      li.appendChild(errorText);
      errorList.appendChild(li);
    }

  }, false);
}
