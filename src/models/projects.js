import mongoose from 'mongoose';

const sample_project = {
  creator: {
    first_name: 'Yuichi',
    last_name: 'Hagio'
  },
  project_name: 'Aurora Project',
  short_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
  long_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  funding_goal: 15000,
  funding_end_date: new Date(+new Date() + 7*24*60*60*1000),
  file_path: 'http://res.cloudinary.com/dck7vqmjo/image/upload/v1459690100/sample.jpg'
};

const projectSchema = new mongoose.Schema({
  'creator': {
    'first_name': {
      'type': String,
      'required': true
    },
    'last_name': {
      'type': String,
      'required': true
    }
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
  }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
