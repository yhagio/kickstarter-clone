////////////////////////////////////////////////////
////////// Validations of Signup Form /////////////
////////////////////////////////////////////////////

// Check Name
export const checkName = (name) => {
  let errorMsg = "";
  const trimmedName = name.trim();

  if(trimmedName.length < 1) {
    errorMsg += 'Name required';
  }

  if(trimmedName.length > 30){
    errorMsg += 'Name should be shorter than 30';
  }

  if(errorMsg.length > 0){
    return errorMsg;
  }
  return null;
}

// Check Email
export const checkEmail = (email) => {
  let errorMsg = "";
  const trimmedEmail = email.trim();

  if (!email.match(/^\S+@\S+\.\S+$/)) {
    errorMsg += "Email must be in valid format";
  }

  if (errorMsg.length > 0) {
    return errorMsg;
  }
  return null;
}

// Check email confirmation
export const checkEmailAgain = (email, emailAgain) => {
  let errorMsg = "";
  const trimmedEmail = email.trim();
  const trimmedEmailAgain = emailAgain.trim();

  if (email !== emailAgain) {
    errorMsg = "Email confirmation doesn't match Email";
  }
  
  if (errorMsg.length > 0) {
    return errorMsg;
  }
  return null;
}

// Check Password
export const checkPassword = (password) => {
  let errors = [];
  const trimmedPassword = password.trim();

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
}

// Check Password Confirmation
export const checkPasswordAgain = (password, passwordAgain) => {
  let errorMsg = "";
  const trimmedPassword = password.trim();
  const trimmedPasswordAgain = passwordAgain.trim();

  if (trimmedPassword !== trimmedPasswordAgain) {
    errorMsg = "Password confirmation doesn't match Password";
  }
  
  if (errorMsg.length > 0) {
    return errorMsg;
  }
  return null;
}

////////////////////////////////////////////////////
/////// Validations of Project Creation Form ///////
////////////////////////////////////////////////////

// checkFundingGoal
export const checkFundingGoal = (goal) => {
  if (goal.length <= 0) {
    return 'Funding goal is required';
  }

  const intGoal = parseInt(goal);

  if (isNaN(intGoal) === true) {
    return 'Funding goal must be number.';
  }
  
  if (intGoal <= 0) {
    return 'Funding goal must be greater then 0.';
  }

  return null;
}

// checkFundingEndDate
export const checkFundingEndDate = (end_date) => {
  if (end_date < new Date()) {
    return 'Funding end date must be later than today.';
  }

  return null;
}

// checkEstimatedDelivery
export const checkEstimatedDelivery = (estimate_date) => {
  if (estimate_date < new Date()) {
    return 'Estimate Delivery date must be later than today.';
  }

  return null;
}

// checkLocation
export const checkLocation = (location) => {
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
}

// check if the string exceeds the limit 
// can be empty
export const checkStrLength = (text, limit, subject) => {
  let errorMessage = '';
  if (text.trim().length > limit) {
    errorMessage = `${subject} cannot be longer then ${limit} characters.`;
  } else {
    errorMessage = null;
  }
  return errorMessage;
}

// check website
// can be empty
export const checkWebsite = (website) => {

}