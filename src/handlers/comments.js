import Comment from '../models/comment';
import Project from '../models/project';
import { validateStringLength } from '../helpers/helpers';

const commentHandler = {
  postComment(req, res) {
    console.log(req.params.id, req.user, req.body.commentInput);
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
      console.log('========\n', result);
      const update = { $addToSet: { comments: result} };
      Project.findOneAndUpdate({_id: req.params.id}, update, (error, data) => {
        if (error) {
          req.flash('danger', 'Something went wrong. Comment creation failed.');
          return res.redirect('/projects/' + req.params.id);
        }
        req.flash('success','Comment created!');
        return res.redirect('/projects/' + req.params.id);
      });

      // req.flash('success','Comment created!');
      // return res.redirect('/projects/' + req.params.id);
    });
  }
};

export default commentHandler;