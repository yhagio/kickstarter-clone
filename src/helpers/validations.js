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

// Validate Email
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

// validate email confirmation
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
