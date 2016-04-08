import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Mongoose.Schema({
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

  picture: {
    type: String
  },

  biography: {
    type: String
  },

  location: {
    type: String
  }, 

  backedProjects: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]

});

// Hash the password before saving it to the db
userSchema.pre('save', function(next) {

  // Access to user model
  const user = this;

  // generate salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash (encrypt) the user's password using salt
    bcrypt.hash(user.password, salt, function(error, hashedPassword) {
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
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

const User = Mongoose.model('User', userSchema);
export default User;
