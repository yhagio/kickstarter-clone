'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectSchema = new _mongoose2.default.Schema({
  // createdBy: {
  // 	type: mongoose.Schema.Types.ObjectId,
  // 	ref: 'User'
  // },

  'project_name': {
    'type': String,
    'unique': true,
    'required': true
  },

  'short_description': {
    'type': String,
    'unique': true,
    'required': true
  },

  'long_description': {
    'type': String,
    'unique': true,
    'required': true
  },

  'funding_goal': {
    'type': Number,
    'required': true
  },

  'funding_end_date': {
    'type': Date,
    'default': new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) //7 days later from now
  },

  'file_path': {
    'type': String
  },

  'num_backers': {
    'type': Number,
    'default': 0
  },

  'current_funding': {
    'type': Number,
    'default': 0
  },

  'estimated_delivery': {
    'type': Date,
    'required': true
  },

  location: {
    type: String,
    required: true
  }

});

var Project = _mongoose2.default.model('Project', projectSchema);

exports.default = Project;