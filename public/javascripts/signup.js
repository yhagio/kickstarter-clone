'use strict';

if (window.location.pathname === '/signup') {

  document.getElementById('signup-form').addEventListener('submit', function(e) {
    
    resetInnerHTML('signup-errors-list');

    var errors = [];

    var checkNameResult = checkStrLength(e, 'Name', 50, 'signupName', true);
    var checkEmailResult = checkEmail(e, 'signupEmail');
    var checkEmailAgainResult = checkEmailAgain(e, 'signupEmail', 'signupEmailagain');
    var checkPasswordResult = checkPassword(e, 'signupPassword');
    var checkPasswordAgainResult = checkPasswordAgain(e, 'signupPassword', 'signupPasswordagain');

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
      window.scrollTo(0, 0);
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

}