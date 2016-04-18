'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _helpers = require('../helpers/helpers');

var _validations = require('../helpers/validations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profileHandler = {
  getPublicProfile: function getPublicProfile(req, res) {
    var userId = req.params.id;
    _user2.default.findById(userId, function (err, user) {
      if (err) {
        req.flash('danger', 'Could not find the user. Try again.');
        return res.redirect('/');
      }
      console.log('Public User: ', user);

      return res.render('profile/public-profile', {
        user: user
      });
    });
  },
  getProfile: function getProfile(req, res) {
    var populateQuery = {
      path: 'backedProjects',
      populate: {
        path: 'rewards',
        match: { backers: req.user }
      }
    };
    _user2.default.findById(req.user._id).populate(populateQuery).exec(function (err, user) {
      if (err) {
        req.flash('danger', 'Could not find the user. Try again.');
        return res.redirect('/');
      }

      if (req.path == '/profile/edit') {
        return res.render('profile/profile-edit', { user: user });
      } else {
        // console.log(' **** \n', user.backedProjects);
        if (user.backedProjects) {
          user.backedProjects.forEach(function (project) {
            console.log(project.rewards.amount);
          });
        }
        return res.render('profile/profile', {
          user: user,
          isOauthed: (0, _helpers.isOauthed)(user)
        });
      }
    });
  },
  updateProfile: function updateProfile(req, res) {
    // Check each fields
    var errors = [];

    var checkProfileNameResult = (0, _validations.checkStrLength)(req.body.profileName, 50, 'Profile Name');
    var checkBioResult = (0, _validations.checkStrLength)(req.body.bio, 300, 'Biography');
    var checkWebsiteResult = (0, _validations.checkStrLength)(req.body.profileWebsite, 120, 'Website');
    var checkLocationResult = (0, _validations.checkStrLength)(req.body.profileLocation, 40, 'Location');

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

    var query = { _id: req.user._id };

    // If no errors, retrieve the user and update
    var update = {
      name: req.body.profileName,
      bio: req.body.bio,
      website: (0, _helpers.checkURL)(req.body.profileWebsite),
      location: req.body.profileLocation
    };

    _user2.default.findOneAndUpdate(query, update, function (err, user) {
      if (err) {
        req.flash('danger', 'Could not find the user. Try again.');
        return res.redirect('/profile');
      }

      req.flash('success', 'Successfully updated profile!');
      return res.redirect('/profile');
    });
  },
  updateProfilePhoto: function updateProfilePhoto(req, res) {
    // create an incoming form object
    var form = new _formidable2.default.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, function (err, fields, files) {

      if (err) {
        req.flash('danger', 'Failed to upload photo. Try again.');
        return res.redirect('/profile/edit');
      }

      var query = { _id: req.user._id };

      // Check if it has image, if not,
      // Assign it to Avatar URL by default
      if (files.profilePhoto.size > 0) {

        _cloudinary2.default.uploader.upload(files.profilePhoto.path, function (data) {

          // If no errors, retrieve the user and update
          var update = { photo: data.secure_url };

          _user2.default.findOneAndUpdate(query, update, function (err, user) {
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
        var update = { photo: (0, _helpers.getGravatarURL)(req.user.email) };

        _user2.default.findOneAndUpdate(query, update, function (err, user) {
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
  updateProfileEmail: function updateProfileEmail(req, res) {
    var errors = [];

    var checkEmailResult = (0, _validations.checkEmail)(req.body.profileEmail);
    var checkEmailAgainResult = (0, _validations.checkEmailAgain)(req.body.profileEmail, req.body.profileEmailagain);

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

    var update = { email: req.body.profileEmail };

    _user2.default.findOneAndUpdate({ _id: req.user._id }, update, function (err, user) {
      if (err) {
        req.flash('danger', 'Could not find the user with current email.');
        return res.redirect('/profile');
      }

      req.flash('success', 'Updated Email.');
      return res.redirect('/profile');
    });
  },
  updateProfilePassword: function updateProfilePassword(req, res) {
    var currentPass = req.body.profileCurrentPassword;
    var newPassword = req.body.profileNewPassword;
    var newPasswordAgain = req.body.profilePasswordagain;
    // Quick check
    // if new password satisfies the requirement and
    // if new password & confirmation password are same
    var errors = [];

    var checkPasswordResult = (0, _validations.checkPassword)(newPassword);
    var checkPasswordAgainResult = (0, _validations.checkPasswordAgain)(newPassword, newPasswordAgain);

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

    _user2.default.findOne({ _id: req.user._id }, function (userErr, data) {
      if (userErr) {
        req.flash('danger', 'User not found.');
        return res.redirect('/profile/edit');
      }

      // Compare user input of current password with database's password
      _bcrypt2.default.compare(currentPass, data.password, function (bcryptErr, result) {
        if (bcryptErr) {
          req.flash('danger', 'Something went wrong. Try again...');
          return res.redirect('/profile/edit');
        }

        if (result === true) {
          // If the passwords match, hash the new password
          _bcrypt2.default.genSalt(10, function (genSaltErr, salt) {
            if (genSaltErr) {
              req.flash('danger', 'Something went wrong in process. Please try again.');
              return res.redirect('/profile/edit');
            }

            _bcrypt2.default.hash(newPassword, salt, function (hashErr, hashedPass) {
              if (hashErr) {
                req.flash('danger', 'Something went wrong in process. Try again.');
                return res.redirect('/profile/edit');
              }

              // Save the new password
              var query = { _id: req.user._id };
              var newHashedPassword = { password: hashedPass };

              _user2.default.findOneAndUpdate(query, newHashedPassword, function (err, user) {
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

exports.default = profileHandler;