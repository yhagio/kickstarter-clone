import User from '../models/user';
import { isOauthed } from '../helpers/helpers';

const profileHandler = {
  getProfile(req, res) {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        req.flash('error', 'Could not find the user. Try again.');
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

  }
};

export default profileHandler;