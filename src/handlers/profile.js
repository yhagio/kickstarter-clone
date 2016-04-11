import cloudinary from 'cloudinary';
import formidable from 'formidable';
import User from '../models/user';
import { 
  isOauthed,
  getGravatarURL
} from '../helpers/helpers';
import { 
  checkStrLength,
} from '../helpers/validations';

const profileHandler = {
  getProfile(req, res) {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        req.flash('danger', 'Could not find the user. Try again.');
        return res.redirect('/');
      }

      if (req.path == '/profile/edit') {
        return res.render('profile/profile-edit', { user: user });
      } else {
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
    console.log('UPDATING', req.body);

    if (!req.user) {
      req.flash('danger', 'You need to login first!');
      return res.redirect('/login');
    }

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
      website: req.body.profileWebsite,
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
    if (!req.user) {
      req.flash('danger', 'You need to login first!');
      return res.redirect('/login');
    }

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

  },

  updateProfilePassword(req, res) {

  } 
};

export default profileHandler;