'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _project = require('../models/project');

var _project2 = _interopRequireDefault(_project);

var _reward = require('../models/reward');

var _reward2 = _interopRequireDefault(_reward);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stripe = require('stripe')(process.env.STRIPE_API_KEY);

var paymentHandler = {
  // User needs to login to the platform to be able to back a project

  backProject: function backProject(req, res) {

    console.log('*** Back Project ***\n', req.body);

    // 1. Need to find "connected stripe account id" of the project creator
    // Retrieve the id by populating 'user.stripe' fields
    var populateQuery = [{ path: 'createdBy', select: 'stripe' }, { path: 'rewards' }];

    _project2.default.findById(req.params.projectid).populate(populateQuery).exec(function (err, project) {
      if (err) {
        console.log('*** Back Project Err ***\n', err);

        req.flash('danger', 'Could not find the project / user. Try again.');
        return res.redirect('/projects/' + req.params.projectid + '/rewards');
      }
      // Option 1: Charge directly
      // https://stripe.com/docs/connect/payments-fees#charging-directly

      stripe.charges.create({
        amount: req.body.chosenAmount * 100,
        currency: 'cad',
        source: req.body.stripeToken,
        description: req.body.chosenDescription,
        application_fee: req.body.chosenAmount * 0.1 * 100 // 7%
      }, {
        stripe_account: project.createdBy.stripe.stripe_user_id
      }, function (error, charge) {
        if (error) {

          console.log('*** Stripe Charge Failed ***\n', error);
          req.flash('danger', error.message);
          return res.redirect('/projects/' + req.params.projectid + '/rewards');
        }

        if (!charge) {
          req.flash('danger', 'Charge did not go through.');
          return res.redirect('/projects/' + req.params.projectid + '/rewards');
        }

        console.log('*** Stripe Charge created ***\n', charge);

        // Update reward
        var rewardUpdate = { $addToSet: { backers: req.user } };
        _reward2.default.findOneAndUpdate({ _id: req.params.rewardid }, rewardUpdate, function (rewardErr, result1) {
          if (rewardErr) {
            req.flash('danger', 'Could not update reward backers.');
            return res.redirect('/projects/' + req.params.projectid + '/rewards');
          }
          // console.log('*** Reward Update \n', result1);
        });

        // Update project
        var projectUpdate = { $addToSet: { backerUserIds: req.user.id } };
        _project2.default.findOneAndUpdate({ _id: req.params.projectid }, projectUpdate, function (projectErr, result2) {
          if (projectErr) {
            req.flash('danger', 'Could not update reward backers.');
            return res.redirect('/projects/' + req.params.projectid + '/rewards');
          }
          // console.log('*** Project Update \n', result2);
        });

        var userUpdate = { $addToSet: { backedProjects: project } };
        _user2.default.findOneAndUpdate({ _id: req.user.id }, userUpdate, function (projectErr, result2) {
          if (projectErr) {
            req.flash('danger', 'Could not update backed projects.');
            return res.redirect('/projects/' + req.params.projectid + '/rewards');
          }
          // console.log('*** Project Update \n', result2);
        });

        // console.log('Charge Complete: \n', charge);
        req.flash('success', 'Successfully backed the project!');
        return res.redirect('/projects/' + req.params.projectid);
      });

      // Option 2: Charge through platform
      // https://stripe.com/docs/connect/payments-fees#charging-through-the-platform

      // stripe.charges.create({
      //   amount: 1000,
      //   currency: 'cad',
      //   source: req.body.stripeToken,
      //   description: 'Sample Charge!!',
      //   application_fee: 300,
      //   destination: project.createdBy.stripe.stripe_user_id
      // }, function(error, charge) {
      //   console.log('Charge Error: ', error);
      //   console.log('Charge Complete: ', charge);
      // });
    });
  }
};

exports.default = paymentHandler;