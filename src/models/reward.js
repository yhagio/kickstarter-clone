import Mongoose from 'mongoose';

const rewardsSchema = new Mongoose.Schema({
  projectId: {
    type: String,
    required: true
  },

  creatorId: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },
  
  shippingDetails: {
    type: String
  },

  estimatedDelivery: {
    'type': Date,
    'required': true
  },

  description: {
    type: String,
    required: true
  },
  
  backers: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

});

const Reward = Mongoose.model('Reward', rewardsSchema);
export default Reward;
