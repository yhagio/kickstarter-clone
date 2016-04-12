import authHandler from './handlers/authentication';
import projectHandler from './handlers/projects';
import paymentHandler from './handlers/payment';
import profileHandler from './handlers/profile';
import commentHandler from './handlers/comments';
import { sendNewPassword } from './handlers/resetPassword';
import { isAuthenticated } from './helpers/passport-config';
import { isLoggedIn, connectOAuthed, isOauthed } from './helpers/helpers';
import passport from 'passport';

export default (app) => {
  // Home
  app.route('/')
    .get((req, res) => res.render('home'));

  // Home
  app.route('/about')
    .get((req, res) => res.render('about'));

  // Sign up
  app.route('/signup')
    .all(isLoggedIn)
    .get((req, res) => res.render('authentication/signup'))
    .post(authHandler.signup);

  // Log in
  app.route('/login')
    .all(isLoggedIn)
    .get((req, res) => res.render('authentication/login'))
    .post(authHandler.login);

  // Log out
  app.route('/logout')
    .get(authHandler.logout);

  // Forgot password
  app.route('/forgot-password')
    .all(isLoggedIn)
    .get((req, res) => res.render('authentication/forgot-password'))
    .post(sendNewPassword);

  // Terms of Use
  app.route('/terms-of-use')
    .get((req, res) => res.render('authentication/terms-of-use'));

  // Privacy Policy
  app.route('/privacy')
    .get((req, res) => res.render('authentication/privacy'));

  // Project Lit
  app.route('/projects')
    .get(projectHandler.getProjectList);

  // Project Detail
  app.route('/projects/:id')
    .get(projectHandler.getProjectPage);

  // Create Project Page
  app.route('/create-project')
    .all(isAuthenticated)
    .all(connectOAuthed)
    .get((req, res) => res.render('projects/project-create'))
    .post(projectHandler.postProjectCreate);

  // Public Profile Page
  app.route('/users/:id')
    .get(profileHandler.getPublicProfile);

  // Profile
  app.route('/profile')
    .all(isAuthenticated)
    .get(profileHandler.getProfile);

  // Profile Update
  app.route('/profile/edit')
    .all(isAuthenticated)
    .get(profileHandler.getProfile);

  app.route('/update-profile')
    .all(isAuthenticated)
    .post(profileHandler.updateProfile);

  app.route('/update-profile-photo')
    .all(isAuthenticated)
    .post(profileHandler.updateProfilePhoto);

  app.route('/update-profile-email')
    .all(isAuthenticated)
    .post(profileHandler.updateProfileEmail);

  app.route('/update-profile-password')
    .all(isAuthenticated)
    .post(profileHandler.updateProfilePassword);

  // Stripe Connect - Custom Option Way 
  app.route('/authorize')
    .get(authHandler.authorize);

  app.route('/oauth/callback')
    .get(authHandler.oauthCallback);

  app.route('/projects/:id/comments')
    .all(isAuthenticated)
    .post(commentHandler.postComment);

  app.route('/delete-comment')
    .all(isAuthenticated)
    .post(commentHandler.deleteComment);

  /* >>>>>>>>> Stripe Connect - Passport Oauth way 
  // http://passportjs.org/docs/oauth
  app.route('/authorize')
    .get(passport.authenticate('provider'));
  app.route('/oauth/callback')
    .get(authHandler.oauthCallBackPassport);
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
  

  app.route('/projects/:id/rewards')
    .all(isAuthenticated)
    .get(projectHandler.getProjectRewardsPage)
    .post(paymentHandler.backProject);    
  
  // Display 404 page when user tries to visit undefined routes
  app.route('*')
    .get((req, res) => res.render('404'));
}
