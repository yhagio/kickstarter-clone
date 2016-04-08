import User from '../models/user';
import Project from '../models/project';

var stripe = require('stripe')(process.env.STRIPE_API_KEY);

const paymentHandler = {
  // User needs to login to the platform to be able to back a project
  backProject(req, res) {

    // 1. Need to find "connected stripe account id" of the project creator
    // Retrieve the id by populating 'user.stripe' fields
    Project.findById(req.params.id).populate('createdBy', 'stripe').exec(function(err, project) {
      if (err) {
        req.flash('error', 'Could not find the project / user. Try again.');
        return res.redirect(`/projects/${req.params.id}/rewards`);
      }
      // Option 1: Charge directly
      // https://stripe.com/docs/connect/payments-fees#charging-directly

      stripe.charges.create({
        amount: 1000,
        currency: 'cad',
        source: req.body.stripeToken,
        description: 'Sample Charge 2!!',
        application_fee: 300
      }, {
        stripe_account: project.createdBy.stripe.stripe_user_id
      }, function(error, charge) {
        if (error) {

          console.log('Stripe Charge Failed: \n', error);
          req.flash('error', error.message);
          return res.redirect(`/projects/${req.params.id}/rewards`);
        }

        console.log('Charge Complete: \n', charge);
        req.flash('success', 'Successfully backed the project!');
        return res.redirect('/profile');
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

export default paymentHandler;