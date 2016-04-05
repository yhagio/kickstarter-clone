import Mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// The user schema

let UserSchema = new Schema({
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
  }
});

// Hash the password before saving it to the db
UserSchema.pre('save', (next) => {
  const user = this;
  console.log('PRe:::::', user, this);
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// compare password in the db and the one user input
UserSchema.methods.comparePassword = (password) => {
  return bcrypt.compareSync(password, this.password);
}

const User = Mongoose.model('User', UserSchema);

export default User;
