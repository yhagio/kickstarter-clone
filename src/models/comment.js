import Mongoose from 'mongoose';

const commentSchema = new Mongoose.Schema({
  projectId: {
    type: String,
    required: true
  },

  createdBy: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  body: {
    type: String,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Comment = Mongoose.model('Comment', commentSchema);
export default Comment;
