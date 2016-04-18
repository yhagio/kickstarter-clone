'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosastic = require('mongoosastic');

var _mongoosastic2 = _interopRequireDefault(_mongoosastic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = require('url');
var elasticConnection = url.parse(process.env.BONSAI_URL);

// import User from './user';

var projectSchema = new _mongoose2.default.Schema({
  'createdBy': {
    'type': _mongoose2.default.Schema.Types.ObjectId,
    'ref': 'User'
    // 'es_schema': User,
    // 'es_select': 'name',
    // 'es_indexed': true
  },

  'project_name': {
    'type': String,
    'unique': true,
    'required': true,
    'es_indexed': true
  },

  'short_description': {
    'type': String,
    'unique': true,
    'required': true,
    'es_indexed': true
  },

  'long_description': {
    'type': String,
    'unique': true,
    'required': true
  },

  'funding_goal': {
    'type': Number,
    'required': true,
    'es_indexed': true
  },

  'funding_end_date': {
    'type': Date,
    'default': new Date(+new Date() + 7 * 24 * 60 * 60 * 1000), //7 days later from now
    'es_indexed': true
  },

  'file_path': {
    'type': String,
    'es_indexed': true
  },

  'current_funding': {
    'type': Number,
    'default': 0,
    'es_indexed': true
  },

  // 'estimated_delivery': {
  //   'type': Date,
  //   'required': true
  // },

  location: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true,
    'es_indexed': true
  },

  backerUserIds: [{
    type: String
  }],

  comments: [{
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Comment'
  }],

  rewards: [{
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Reward'
  }]

});

// Heroku
// projectSchema.plugin(mongoosastic, {
//   host: elasticConnection.hostname,
//   auth: elasticConnection.auth,
//   port: '',
//   protocol: elasticConnection.protocol === 'https:' ? 'http' : 'https'
// });

// Development
projectSchema.plugin(_mongoosastic2.default, {
  hosts: ['localhost:9200']
  // populate: [
  //   {path: 'createdBy'}
  // ]
});

var Project = _mongoose2.default.model('Project', projectSchema);
exports.default = Project;