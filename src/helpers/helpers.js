// Check if user is logged in
export function isLoggedIn(req, res, next){
  if (!req.isAuthenticated()) {
    return next();
  } 
  return res.redirect('/projects');
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