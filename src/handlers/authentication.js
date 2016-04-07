import async from 'async';
import passport from 'passport';
import { isAuthenticated } from '../helpers/passport-config';
import User from '../models/user';
import qs from 'querystring';
import request from 'request';


const authHandler = {
  signup(req, res, next) {

    async.waterfall(
      [
        function(callback) {
          // Create a new User object
          let userObj = new User({
            name: req.body.signupName,
            email: req.body.signupEmail,
            password: req.body.signupPassword
          });

          // TODO: check fields

          // Check if user already exists
          User.findOne({ email: req.body.signupEmail}, (err, user) => {
            if (err) {
              req.flash('error', 'Something went wrong. Please try again.')
              return res.redirect('/signup');
            }

            if (user) {
              req.flash('error', 'Account with the email already exists.');
              return res.redirect('/signup');
            }
            
            // Save the user into database
            userObj.save((saveErr, signUpUser) => {
              if (saveErr) {
                console.log('ERR', saveErr);
                req.flash('error', 'Could not save new user, please try again.')
                return res.redirect('/signup');
              }

              callback(null, signUpUser);
            });
          });
        },
          
        // Let signup user Login automatically
        function(user) {
          req.logIn(user, function(err) {
            if (err) {
              req.flash('error', 'Login failed, try to log in again.');
              return res.redirect('/login');
            }

            req.flash('success', 'Signed up & Logged in!');
            return res.redirect('/projects');
          });
        }
      ]
    );

  },

  logout(req, res, next) {
    req.logout();
    req.flash('success', 'You are logged out.');
    res.redirect('/login');
  },

  login(req, res) {    
    passport.authenticate('local', {
      successRedirect: '/projects',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res);
  },

  /* >>>>> Passport-OAuth2 attempt >>>>>
  oauthCallBackPassport(req, res) {
    passport.authenticate('provider', { 
      successRedirect: '/profile',
      failureRedirect: '/profile',
      failureFlash: true
    })(req, res);
  },
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

  // Stripe connect authorize
  // https://stripe.com/docs/connect/standalone-accounts
  // i.e. https://gist.github.com/padolsey/7109113
  authorize(req, res) {
    // Redirect to Stripe /oauth/authorize endpoint
    res.redirect(process.env.STRIPE_AUTHORIZE_URI + '?' + qs.stringify({
      response_type: 'code',
      scope: 'read_write',
      client_id: process.env.STRIPE_CLIENT_ID
    }));
  },

  oauthCallback(req, res) {
    const code = req.query.code;
    // Make /oauth/token endpoint POST request
    request.post({
      url: process.env.STRIPE_TOKEN_URI,
      form: {
        grant_type: 'authorization_code',
        client_id: process.env.STRIPE_CLIENT_ID,
        code: code,
        client_secret: process.env.STRIPE_API_KEY
      }
    }, function(err, r, body) {
      if (err) {
        req.flash('error', err.error_description);
        return res.redirect('/profile');
      }

      const parsedBody = JSON.parse(body);
      
      const accessToken = parsedBody.access_token;
      const refreshToken = parsedBody.refresh_token;
      const stripeUserId = parsedBody.stripe_user_id;
      
      let userObject = {
        stripe: {
          access_token: accessToken,
          refresh_token: refreshToken,
          stripe_user_id: stripeUserId
        }
      };
      
      // Update the user information (Adding Stripe inofrmation)
      User.findOneAndUpdate({_id: req.user._id}, userObject, (err, user) => {
        if (err) {
          req.flash('error', 'Could not process the authentication. Try again.');
          return res.redirect('/profile');
        } else {
          req.flash('info', 'Successfully authenticated');
          return res.redirect('/create-project');
        }
      });
      
    });
  }
}

export default authHandler;
