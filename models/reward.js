'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rewardsSchema = new _mongoose2.default.Schema({
  // projectId: {
  //   type: String,
  //   required: true
  // },

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
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User'
  }]

});

var Reward = _mongoose2.default.model('Reward', rewardsSchema);
exports.default = Reward;