import crypto from 'crypto';

// Check if user is logged in
export function isLoggedIn(req, res, next){
  if (!req.isAuthenticated()) {
    return next();
  } 
  return res.redirect('/projects');
}

// Check if user is authenticated through Stripe
export function connectOAuthed(req, res, next){
  if (req.user && req.user.stripe.access_token) {
    return next();
  } 
  return res.redirect('/profile');
}

// Check if user has connected to Stripe connect
export function isOauthed(user) {
  if (user.stripe.access_token) {
    return true;
  } 
  return false;
}

// Calculate the day until it expires
export function getDayTilEnd(endDate) {
  let timeDiff = new Date(endDate).getTime() - new Date().getTime();

  if (timeDiff <= 0) {
    return '0 seconds';
  }

  let day = timeDiff / (1000 * 3600 * 24);

  if (day >= 2) {
    return parseInt(day) + ' days';
  }


  if (day < 1) { // in hours

    let hours = timeDiff / (60 * 60 * 1000);

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

// Calculate percentage of funding backed
export function getFundingPercentage(goal$, current$) {
  return (current$ / goal$) * 100;
}

// Check String length
export function validateStringLength(text, limit, subject) {
  let errorMessage = '';
  if (text.trim().length > limit) {
    errorMessage = `${subject} cannot be more than ${limit} characters.`;
  } else if (text.trim().length <= 0) {
    errorMessage = `${subject} cannot be empty.`;
  } else {
    errorMessage = null;
  }
  return errorMessage;
}

export function getGravatarURL(email, size=200) {
  const md5 = crypto.createHash('md5').update(email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}