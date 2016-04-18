'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = new _mongoose2.default.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  stripe: {
    access_token: {
      type: String
    },
    refresh_token: {
      type: String
    },
    stripe_user_id: { // Connected Account ID
      type: String
    }
  },

  website: {
    type: String
  },

  photo: {
    type: String
  },

  bio: {
    type: String
  },

  location: {
    type: String
  },

  backedProjects: [{
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Project'
  }]

});

// Hash the password before saving it to the db
userSchema.pre('save', function (next) {

  // Access to user model
  var user = this;

  // generate salt
  _bcrypt2.default.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    // hash (encrypt) the user's password using salt
    _bcrypt2.default.hash(user.password, salt, function (error, hashedPassword) {
      if (error) {
        return next(err);
      }

      // overwrite user's password with hashed password
      user.password = hashedPassword;
      next();
    });
  });
});

// compare password in the db and the one user input
userSchema.methods.comparePassword = function (password) {
  return _bcrypt2.default.compareSync(password, this.password);
};

var User = _mongoose2.default.model('User', userSchema);
exports.default = User;