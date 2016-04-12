import Comment from '../models/comment';
import Project from '../models/project';
import { validateStringLength } from '../helpers/helpers';

const commentHandler = {
  postComment(req, res) {
    // Check if it has comment body
    const commentCheckResult = validateStringLength(req.body.commentInput, 300, 'Comment');

    if (commentCheckResult !== null) {
      req.flash('danger', commentCheckResult);
      return res.redirect('/projects/' + req.params.id);
    }

    // Save the comment in database
    let newComment = new Comment({
      projectId: req.params.id,
      createdBy: req.user,
      body: req.body.commentInput
    });

    newComment.save((err, result) => {
      if (err) {
        req.flash('danger', 'Something went wrong, comment creation failed.');
        return res.redirect('/projects/' + req.params.id);
      }

      // Connect the comment model ref to Project model
      const update = { $addToSet: { comments: result} };
      Project.findOneAndUpdate({_id: req.params.id}, update, (error, data) => {
        if (error) {
          req.flash('danger', 'Something went wrong. Comment creation failed.');
          return res.redirect('/projects/' + req.params.id);
        }
        req.flash('success','Comment created!');
        return res.redirect('/projects/' + req.params.id);
      });

    });
  },

  deleteComment(req, res) {
    const commentId = req.body.commentId;
    const pathname = req.body.pathname;

    Comment.findOneAndRemove({_id: commentId, createdBy: req.user}, (err, result) => {
      if (err) {
        req.flash('danger', 'Could not remove the comment. Try again.');
        return res.send({redirect: pathname});
      }

      if (result === null) {
        req.flash('danger', 'Could not remove the comment.');
        return res.send({redirect: pathname});
      }
      
      req.flash('success','Comment removed!');
      return res.send({redirect: pathname});
    });
  }
};

export default commentHandler;