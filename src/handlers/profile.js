import cloudinary from 'cloudinary';
import formidable from 'formidable';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { 
  isOauthed,
  getGravatarURL,
  checkURL
} from '../helpers/helpers';
import { 
  checkStrLength,
  checkEmail,
  checkEmailAgain,
  checkPassword,
  checkPasswordAgain
} from '../helpers/validations';

const profileHandler = {
  getPublicProfile(req, res) {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
      if (err) {
        req.flash('danger', 'Could not find the user. Try again.');
        return res.redirect('/');
      }
      console.log('Public User: ', user)

      return res.render(
        'profile/public-profile', {
          user: user
        }
      );
      
    });
  },

  getProfile(req, res) {
    const populateQuery = {
      path: 'backedProjects',
      populate: {
        path: 'rewards',
        match: { backers: req.user }
      }
    }
    User.findById(req.user._id).populate(populateQuery).exec((err, user) => {
      if (err) {
        req.flash('danger', 'Could not find the user. Try again.');
        return res.redirect('/');
      }

      if (req.path == '/profile/edit') {
        return res.render('profile/profile-edit', { user: user });
      } else {
        // console.log(' **** \n', user.backedProjects);
        if ( user.backedProjects ) {
          user.backedProjects.forEach(function(project) {
            console.log(project.rewards.amount);
          });
        }
        return res.render(
          'profile/profile', {
            user: user,
            isOauthed: isOauthed(user)
          }
        );
      }
    });
  },

  updateProfile(req, res) {
    // Check each fields
    let errors = [];

    const checkProfileNameResult = checkStrLength(req.body.profileName, 50, 'Profile Name');
    const checkBioResult = checkStrLength(req.body.bio, 300, 'Biography');
    const checkWebsiteResult = checkStrLength(req.body.profileWebsite, 120, 'Website');
    const checkLocationResult = checkStrLength(req.body.profileLocation, 40, 'Location');

    if (checkProfileNameResult !== null) {
      errors.push(checkProfileNameResult);
    }
    if (checkBioResult !== null) {
      errors.push(checkBioResult);
    }
    if (checkWebsiteResult !== null) {
      errors.push(checkWebsiteResult);
    }
    if (checkLocationResult !== null) {
      errors.push(checkLocationResult);
    }

    // Final check
    if (errors.length > 0) {
      req.flash('danger', errors);
      return res.redirect('/profile/edit');
    }

    const query = { _id: req.user._id };
      
    // If no errors, retrieve the user and update
    const update = { 
      name: req.body.profileName,
      bio: req.body.bio,
      website: checkURL(req.body.profileWebsite),
      location: req.body.profileLocation
    };

    User.findOneAndUpdate(query, update, (err, user) => {
      if (err) {
        req.flash('danger', 'Could not find the user. Try again.');
        return res.redirect('/profile');
      }

      req.flash('success', 'Successfully updated profile!');
      return res.redirect('/profile');
    });
  },

  updateProfilePhoto(req, res) {
    // create an incoming form object
    const form = new formidable.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {

      if (err) {
        req.flash('danger', 'Failed to upload photo. Try again.');
        return res.redirect('/profile/edit');
      }

      const query = { _id: req.user._id };

      // Check if it has image, if not,
      // Assign it to Avatar URL by default
      if (files.profilePhoto.size > 0) {

        cloudinary.uploader.upload(files.profilePhoto.path, (data) => {
        
          // If no errors, retrieve the user and update
          const update = { photo: data.secure_url };

          User.findOneAndUpdate(query, update, (err, user) => {
            if (err) {
              req.flash('danger', 'Could not find the user. Try again.');
              return res.redirect('/profile');
            }

            req.flash('success', 'Successfully uploaded profile photo!');
            return res.redirect('/profile');
          });
        });

      } else {
        // if no profile image path is assigned
        // Use Avatar
        const update = { photo: getGravatarURL(req.user.email) };

        User.findOneAndUpdate(query, update, (err, user) => {
          if (err) {
            req.flash('danger', 'Could not find the user. Try again.');
            return res.redirect('/profile');
          }

          req.flash('success', 'Use Gravatar photo!');
          return res.redirect('/profile');
        });
      }

 
    });
  },

  updateProfileEmail(req, res) {
    let errors = [];

    const checkEmailResult = checkEmail(req.body.profileEmail);
    const checkEmailAgainResult = checkEmailAgain(req.body.profileEmail, req.body.profileEmailagain);

    if (checkEmailResult !== null) {
      errors.push(checkEmailResult);
    }
    if (checkEmailAgainResult !== null) {
      errors.push(checkEmailAgainResult);
    }

    if (errors.length > 0) {
      req.flash('danger', errors);
      return res.redirect('/profile/edit');
    }

    const update = { email: req.body.profileEmail };

    User.findOneAndUpdate({ _id: req.user._id }, update, (err, user) => {
      if (err) {
        req.flash('danger', 'Could not find the user with current email.');
        return res.redirect('/profile');
      }

      req.flash('success', 'Updated Email.');
      return res.redirect('/profile');
    });

  },

  updateProfilePassword(req, res) {
    const currentPass = req.body.profileCurrentPassword;
    const newPassword = req.body.profileNewPassword;
    const newPasswordAgain = req.body.profilePasswordagain;
    // Quick check 
    // if new password satisfies the requirement and 
    // if new password & confirmation password are same
    let errors = [];

    const checkPasswordResult = checkPassword(newPassword);
    const checkPasswordAgainResult = checkPasswordAgain(newPassword, newPasswordAgain);

    if (checkPasswordResult !== null) {
      errors.push(checkPasswordResult);
    }
    if (checkPasswordAgainResult !== null) {
      errors.push(checkPasswordAgainResult);
    }

    if (errors.length > 0) {
      req.flash('danger', errors);
      return res.redirect('/profile/edit');
    }

    User.findOne({_id: req.user._id}, (userErr, data) => {
      if (userErr) {
        req.flash('danger', 'User not found.');
        return res.redirect('/profile/edit');
      }

      // Compare user input of current password with database's password
      bcrypt.compare(currentPass, data.password, (bcryptErr, result) => {
        if (bcryptErr){
          req.flash('danger', 'Something went wrong. Try again...');
          return res.redirect('/profile/edit');
        } 
        
        if (result === true) {
          // If the passwords match, hash the new password
          bcrypt.genSalt(10, (genSaltErr, salt) => {
            if (genSaltErr) {
              req.flash('danger', 'Something went wrong in process. Please try again.');
              return res.redirect('/profile/edit');
            }

            bcrypt.hash(newPassword, salt, (hashErr, hashedPass) => {
              if (hashErr) {
                req.flash('danger', 'Something went wrong in process. Try again.');
                return res.redirect('/profile/edit');
              }

              // Save the new password
              var query = {_id: req.user._id};
              var newHashedPassword = {password: hashedPass};

              User.findOneAndUpdate(query, newHashedPassword, (err, user) => {
                if (err) {
                  req.flash('danger', 'Could not update your password. Try again.');
                  return res.redirect('/profile/edit');
                } 
                
                req.flash('success', 'Updated Password.');
                return res.redirect('/profile');
              });

            });
          });
        } else {
          // Current Password is incorrect
          req.flash('danger', 'Current password is incorrect. Try again.');
          return res.redirect('/profile/edit');
        }

      });

    });

  } 
};

export default profileHandler;