import passport from 'passport';
import { Strategy } from 'passport-local';
import User from '../models/user';
/***
 Serialize and deserialize
***/

// Serialize: translate the data structure
// to the format that can be stored in connect-mongo
passport.serializeUser((user, done)=> {
  done(null, user._id);
});

// Deserialize: retrieve tha data stored by serialization
passport.deserializeUser((id, done)=> {
  User.findById(id, (err, user)=> {
    if (err) {
      return done(err);
    }
    done(err, user);
  });
});

// Login
passport.use('local',
  new Strategy({
    // Custom
    // Login with email instead of username(default)
    'usernameField': 'loginEmail',
    'passwordField': 'loginPassword',
    'passReqToCallback': true
  }, (req, email, password, done)=> {

    User.findOne({ email: email }, (err, user)=> {
      // Check if user exists and,
      // Check if user's password is correct (same as the one in DB)
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, req.flash('error', 'User not found with this email.'));
      }

      if (!user.comparePassword(password)) {
        return done(null, false, req.flash('error', 'Incorrect password.'));
      }

      return done(null, user);
    });
  }
));

/* >>>>>>>>>>>>>>>>>  OAuth for project creator >>>>>>>>>>>
import { OAuth2Strategy } from 'passport-oauth';

// http://passportjs.org/docs/oauth
const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID;
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const STRIPE_TOKEN_URI = process.env.STRIPE_TOKEN_URI;
const STRIPE_AUTHORIZE_URI = process.env.STRIPE_AUTHORIZE_URI;

passport.use('provider', new OAuth2Strategy({
    authorizationURL: STRIPE_AUTHORIZE_URI,
    tokenURL: STRIPE_TOKEN_URI,
    clientID: STRIPE_CLIENT_ID,
    clientSecret: STRIPE_API_KEY,
    callbackURL: 'http://192.168.33.10:3000/oauth/callback',
    passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('AccessToken: ', accessToken);
    console.log('RefreshToken: ', refreshToken);
    console.log('Profile: ', profile);
    
    // let userObject = {
    //   stripe: {
    //     access_token: accessToken,
    //     refresh_token: refreshToken,
    //     stripe_user_id: stripeUserId
    //   }
    // };
    
    // // Update the user information (Adding Stripe inofrmation)
    // User.findOneAndUpdate({_id: req.user._id}, userObject, (err, user) => {
    //   if (err) {
    //     req.flash('error', 'Could not process the authentication. Try again.');
    //     return res.redirect('/profile');
    //   } else {
    //     req.flash('info', 'Successfully authenticated');
    //     return res.redirect('/profile');
    //   }
    // });
  }
));
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

// Custom middleware to check if the user is authenticated (logged in)
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
