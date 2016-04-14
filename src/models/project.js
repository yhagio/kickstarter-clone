import Mongoose from 'mongoose';

const projectSchema = new Mongoose.Schema({
  createdBy: {
  	type: Mongoose.Schema.Types.ObjectId,
  	ref: 'User'
  },

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
    'default': new Date(+new Date() + 7*24*60*60*1000) //7 days later from now
  },

  'file_path': {
    'type': String
  },

  'current_funding': {
    'type': Number,
    'default': 0
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
    required: true
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
  }]

});

const Project = Mongoose.model('Project', projectSchema);
export default Project;
