// Validate user's email format
export const validateEmail = (email) => {
  let errorMessage = '';
  const regex = /\S+@\S+\.\S+/;
  const trimmedEmail = email.trim();

  if (trimmedEmail.length > 50) {
    errorMessage = '* Email is too long, please use shorter email address';
  }

  if (!regex.test(trimmedEmail) || trimmedEmail.length === 0) {
    errorMessage = '* Email must be in valid format';
  }

  return errorMessage;
};

// Validate user's password format
export const validatePassword = (password) => {
  let errorMessages = [];

  if (password.length > 25) {
    errorMessages.push('* Must be fewer than 50 chars');
  }

  if (password.length < 8) {
    errorMessages.push('* Must be longer than 7 chars');
  }

  // if (!password.match(/[\!\@\#\$\%\^\&\*]/g)) {
  //   errorMessages.push('* Missing a symbol(! @ # $ % ^ & *)');
  // }

  if (!password.match(/\d/g)) {
    errorMessages.push('* Must have a number');
  }

  if (!password.match(/[a-z]/g)) {
    errorMessages.push('* Must have a lowercase letter');
  }

  if (!password.match(/[A-Z]/g)) {
    errorMessages.push('* Must have an uppercase letter');
  }

  return errorMessages;
}

// Validate user's text input length
// Must be 1 - (limit) characters
export const validateStrLength = (limit, text) => {
  let errorMessage = '';
  if (text.trim().length > limit) {
    errorMessage = `* Cannot be more than ${limit} characters`;
  } else if (text.trim().length <= 0) {
    errorMessage = '* Cannot be empty';
  } else {
    errorMessage = '';
  }
  return errorMessage;
}

// Validate both inputs are same
export const areBothSame = (input1, input2) => {
  return (input1 === input2) ? true : false;
}