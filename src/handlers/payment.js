import User from '../models/user';
import Project from '../models/project';

var stripe = require('stripe')(process.env.STRIPE_API_KEY);

const paymentHandler = {
  // User needs to login to the platform to be able to back a project
  backProject(req, res) {
    // console.log('stripeToken: ', req.body.stripeToken); // Submitted card infos
    // console.log('REQUEST USER: ', req.user); // Logged-in user
    // console.log('PARAMS: ', req.params.id);

    // 1. Need to find CONNECTED_STRIPE_ACCOUNT_ID of the project creator
    // Project has connected_stripe_account_id of creator
    // or populate through stripe.stripe_user_id of createdBy

    Project.findById(req.params.id).populate('createdBy', 'stripe').exec(function(err, project) {
      console.log('ERR: ', err);
      console.log('USER STRIPE: ', project); // user.stripe.stripe_user_id
      
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
        console.log('Charge Error: ', error);
        console.log('Charge Complete: ', charge);
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