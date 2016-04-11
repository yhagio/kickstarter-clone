'use strict';

// function checkStrLength(e, subject, limit, element_id) {
//   var errorMsg = "";
//   if (!document.getElementById(element_id).value) {
//     return subject + ' required';
//   }
//   var data = document.getElementById(element_id).value.trim();
  

//   if(data.length < 1) {
//     errorMsg += subject + ' required';
//   }

//   if(data.length > limit){
//     errorMsg += subject + ' should be shorter than ' + limit;
//   }

//   if(errorMsg.length > 0){
//     if(e){
//       e.preventDefault();
//     }

//     return errorMsg;
//   }
//   return null;
// }

function checkCoverPhoto(e) {
  var data = document.getElementById('cover_photo').value;
  var errorMsg = "";

  if(data === "") {
    errorMsg += 'Cover photo is rquired.';
  }

  if(errorMsg.length > 0){
    if(e){
      e.preventDefault();
    }

    return errorMsg;
  }
  return null;
}

function checkFundingGoal(e) {
  var element = document.getElementById('funding_goal');
  var errorMsg = "";

  if (!element.value) {
    errorMsg += 'Funding Goal is required';
  } else {
    if(isNaN(parseInt(element.value)) === true) {
      errorMsg += 'Funding Goal must be number ($)';
    }

    if(parseInt(element.value) <= 0) {
      errorMsg += 'Funding Goal must be greater than 0.';
    }
  }

  if(errorMsg.length > 0){
    if(e){
      e.preventDefault();
    }

    return errorMsg;
  }
  return null;
}

function checkDate(e, target_id, subject) {
  var data = document.getElementById(target_id).value;
  var errorMsg = "";
  
  if (!data) {
    errorMsg += subject + ' is required.';
  } else {
    if (new Date(data) < new Date()) {
      errorMsg += subject + ' date must be later than today.';
    }
  }

  if(errorMsg.length > 0){
    if(e){
      e.preventDefault();
    }

    return errorMsg;
  }
  return null;
}

function checkLocation(e) {
  var element = document.getElementById('location');
  var errorMsg = "";
  if (!element.value) {
    return 'Loaction name is required';
  }
  var data = element.value.trim();

  if (isNaN(parseInt(data)) === false) {
    errorMsg += 'Location name cannot be number';
  }

  if(data.length < 1) {
    errorMsg += 'Location is required.';
  }

  if(data.length > 30) {
    errorMsg += 'Location name is too long.';
  }

  if(errorMsg.length > 0){
    if(e){
      e.preventDefault();
    }

    return errorMsg;
  }
  return null;
}


if (window.location.pathname === '/create-project') {

  document.getElementById('project-form').addEventListener('submit', function(e) {
    
    resetInnerHTML('project-errors-list');

    var errors = [];

    var projectNameResult = checkStrLength(e, 'Project Name', 80, 'project_name');
    var shortDescriptionResult = checkStrLength(e, 'Short Description', 140, 'short_description');
    var longDescriptionResult = checkStrLength(e, 'Long Description', 400, 'long_description');
    var checkcCoverPhotoResult = checkCoverPhoto(e);
    var checkFundingResult = checkFundingGoal(e);
    var checkEndDateResult = checkDate(e, 'funding_end_date', 'Funding End Date');
    var checkDeliveryDateResult = checkDate(e, 'estimated_delivery', 'Estimate Delivery Date');
    var checkLocationResult = checkLocation(e);

    // Gather all the errors
    if (projectNameResult !== null) {
      errors.push(projectNameResult);
    }
    if (shortDescriptionResult !== null) {
      errors.push(shortDescriptionResult);
    }
    if (longDescriptionResult !== null) {
      errors.push(longDescriptionResult);
    }
    if (checkcCoverPhotoResult !== null) {
      errors.push(checkcCoverPhotoResult);
    }
    if (checkFundingResult !== null) {
      errors.push(checkFundingResult);
    }
    if (checkEndDateResult !== null) {
      errors.push(checkEndDateResult);
    }
    if (checkDeliveryDateResult !== null) {
      errors.push(checkDeliveryDateResult);
    }
    if (checkLocationResult !== null) {
      errors.push(checkLocationResult);
    }

    // Display the errors
    if (errors.length > 0) {
      document.getElementById('project-errors-box').className += ' show';
      window.scrollTo(0, 0);
    }

    var errorList = document.getElementById('project-errors-list');
    for (var i = 0; errors.length > i; i++) {
      var li = document.createElement("li");
      var errorText = document.createTextNode(errors[i]);
      li.appendChild(errorText);
      errorList.appendChild(li);
    }

  }, false);

}