'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _comment = require('../models/comment');

var _comment2 = _interopRequireDefault(_comment);

var _project = require('../models/project');

var _project2 = _interopRequireDefault(_project);

var _helpers = require('../helpers/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commentHandler = {
  postComment: function postComment(req, res) {
    // Check if it has comment body
    var commentCheckResult = (0, _helpers.validateStringLength)(req.body.commentInput, 300, 'Comment');

    if (commentCheckResult !== null) {
      req.flash('danger', commentCheckResult);
      return res.redirect('/projects/' + req.params.id);
    }

    // Save the comment in database
    var newComment = new _comment2.default({
      projectId: req.params.id,
      createdBy: req.user,
      body: req.body.commentInput
    });

    newComment.save(function (err, result) {
      if (err) {
        req.flash('danger', 'Something went wrong, comment creation failed.');
        return res.redirect('/projects/' + req.params.id);
      }

      // Connect the comment model ref to Project model
      var update = { $addToSet: { comments: result } };
      _project2.default.findOneAndUpdate({ _id: req.params.id }, update, function (error, data) {
        if (error) {
          req.flash('danger', 'Something went wrong. Comment creation failed.');
          return res.redirect('/projects/' + req.params.id);
        }
        req.flash('success', 'Comment created!');
        return res.redirect('/projects/' + req.params.id);
      });
    });
  },
  deleteComment: function deleteComment(req, res) {
    var commentId = req.body.commentId;
    var pathname = req.body.pathname;

    _comment2.default.findOneAndRemove({ _id: commentId, createdBy: req.user }, function (err, result) {
      if (err) {
        req.flash('danger', 'Could not remove the comment. Try again.');
        return res.send({ redirect: pathname });
      }

      if (result === null) {
        req.flash('danger', 'Could not remove the comment.');
        return res.send({ redirect: pathname });
      }

      req.flash('success', 'Comment removed!');
      return res.send({ redirect: pathname });
    });
  }
};

exports.default = commentHandler;