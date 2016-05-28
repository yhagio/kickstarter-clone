'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authentication = require('./handlers/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _projects = require('./handlers/projects');

var _projects2 = _interopRequireDefault(_projects);

var _payment = require('./handlers/payment');

var _payment2 = _interopRequireDefault(_payment);

var _profile = require('./handlers/profile');

var _profile2 = _interopRequireDefault(_profile);

var _comments = require('./handlers/comments');

var _comments2 = _interopRequireDefault(_comments);

var _search = require('./handlers/search');

var _search2 = _interopRequireDefault(_search);

var _resetPassword = require('./handlers/resetPassword');

var _passportConfig = require('./helpers/passport-config');

var _helpers = require('./helpers/helpers');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  // Home
  app.route('/').get(function (req, res) {
    return res.render('home');
  });

  // About
  // app.route('/about')
  // .get((req, res) => res.render('about'));

  // Sign up
  app.route('/signup').all(_helpers.isLoggedIn).get(function (req, res) {
    return res.render('authentication/signup');
  }).post(_authentication2.default.signup);

  // Log in
  app.route('/login').all(_helpers.isLoggedIn).get(function (req, res) {
    return res.render('authentication/login');
  }).post(_authentication2.default.login);

  // Log out
  app.route('/logout').get(_authentication2.default.logout);

  // Forgot password
  app.route('/forgot-password').all(_helpers.isLoggedIn).get(function (req, res) {
    return res.render('authentication/forgot-password');
  }).post(_resetPassword.sendNewPassword);

  // Terms of Use
  app.route('/terms-of-use').get(function (req, res) {
    return res.render('authentication/terms-of-use');
  });

  // Privacy Policy
  app.route('/privacy').get(function (req, res) {
    return res.render('authentication/privacy');
  });

  // Discover Page
  app.route('/discover').get(_projects2.default.getDiscoverPage);

  // Project Lit
  app.route('/projects').get(_projects2.default.getProjectList);

  // Project Detail
  app.route('/projects/:id').get(_projects2.default.getProjectPage);

  // Create Project Page
  app.route('/create-project').all(_passportConfig.isAuthenticated).all(_helpers.connectOAuthed).get(function (req, res) {
    return res.render('projects/project-create');
  }).post(_projects2.default.postProjectCreate);

  // Public Profile Page
  app.route('/users/:id').get(_profile2.default.getPublicProfile);

  // Profile
  app.route('/profile').all(_passportConfig.isAuthenticated).get(_profile2.default.getProfile);

  // Profile Update
  app.route('/profile/edit').all(_passportConfig.isAuthenticated).get(_profile2.default.getProfile);

  app.route('/update-profile').all(_passportConfig.isAuthenticated).post(_profile2.default.updateProfile);

  app.route('/update-profile-photo').all(_passportConfig.isAuthenticated).post(_profile2.default.updateProfilePhoto);

  app.route('/update-profile-email').all(_passportConfig.isAuthenticated).post(_profile2.default.updateProfileEmail);

  app.route('/update-profile-password').all(_passportConfig.isAuthenticated).post(_profile2.default.updateProfilePassword);

  // Project + Category Page
  app.route('/categories/:name').get(_projects2.default.getProjectWithCategory);

  // Stripe Connect - Custom Option Way
  app.route('/authorize').get(_authentication2.default.authorize);

  app.route('/oauth/callback').get(_authentication2.default.oauthCallback);

  app.route('/projects/:id/comments').all(_passportConfig.isAuthenticated).post(_comments2.default.postComment);

  app.route('/delete-comment').all(_passportConfig.isAuthenticated).post(_comments2.default.deleteComment);

  /* >>>>>>>>> Stripe Connect - Passport Oauth way 
  // http://passportjs.org/docs/oauth
  app.route('/authorize')
    .get(passport.authenticate('provider'));
  app.route('/oauth/callback')
    .get(authHandler.oauthCallBackPassport);
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

  // Create Reward (Only creator can do it)
  app.route('/projects/:id/create-reward').all(_passportConfig.isAuthenticated).all(_helpers.connectOAuthed).get(_projects2.default.getRewardForm).post(_projects2.default.createRewards);

  // Project rewards
  app.route('/projects/:id/rewards').all(_passportConfig.isAuthenticated).get(_projects2.default.getProjectRewardsPage);
  // .post(paymentHandler.backProject); 

  // Pay for chosen reward for the project
  app.route('/projects/:projectid/rewards/:rewardid').all(_passportConfig.isAuthenticated).get(_projects2.default.getChosenRewardPage).post(_payment2.default.backProject);

  // Search Projects
  app.route('/search').get(_search2.default.getSearchResult).post(_search2.default.postSearch);

  // Display 404 page when user tries to visit undefined routes
  app.route('*').get(function (req, res) {
    return res.render('404');
  });
};