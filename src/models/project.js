import Mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';

const projectSchema = new Mongoose.Schema({
  'createdBy': {
  	'type': Mongoose.Schema.Types.ObjectId,
    'ref': 'User'
  },

  'project_name': {
    'type': String,
    'unique': true,
    'required': true,
    'es_indexed':true
  },

  'short_description': {
    'type': String,
    'unique': true,
    'required': true,
    'es_indexed':true
  },

  'long_description': {
    'type': String,
    'unique': true,
    'required': true,
    'es_indexed':true
  },

  'funding_goal': {
    'type': Number,
    'required': true,
    'es_indexed':true
  },

  'funding_end_date': {
    'type': Date,
    'default': new Date(+new Date() + 7*24*60*60*1000), //7 days later from now
    'es_indexed':true
  },

  'file_path': {
    'type': String,
    'es_indexed':true
  },

  'current_funding': {
    'type': Number,
    'default': 0,
    'es_indexed':true
  },

  // 'estimated_delivery': {
  //   'type': Date,
  //   'required': true
  // },

  location: {
    type: String,
    required: true,
    'es_indexed':true
  },

  category: {
    type: String,
    required: true,
    'es_indexed':true
  },

  backerUserIds: [{
    type: String
  }],

  comments: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],

  rewards: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Reward'
  }],

  createdAt: {
    type: Date,
    default: Date.now 
  }

});

if (process.env.NODE_ENV === 'production') {
  var url = require('url');
  var elasticConnection = url.parse(process.env.BONSAI_URL);
  // Heroku Add-on Bonsai (Production)
  projectSchema.plugin(_mongoosastic2.default, {
    host: elasticConnection.hostname,
    auth: elasticConnection.auth,
    port: '',
    protocol: elasticConnection.protocol === 'https:' ? 'http' : 'https'
  });
} else {
  // Local (Development)
  projectSchema.plugin(mongoosastic, {
    hosts: [
      'localhost:9200'
    ]
    // populate: [
    //   {path: 'createdBy'}
    // ]
  });
}


const Project = Mongoose.model('Project', projectSchema);
export default Project;
