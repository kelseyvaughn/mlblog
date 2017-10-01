import mongoose from 'mongoose';

/**
 *  CommentSchema
 */
const CommentSchema = new mongoose.Schema({
  // UUID of the comment.
  uuid: {
    type: String,
    unique: true
  },
  // The date time stamp when the comment was created.
  // set defult to now
  datetime: {
    type: String,
    default: (new Date()).toISOString(),
    required: true 
  },
  // Parent blog post id.
  blog_post_id: { 
    type: String,
    required: true
  },
  // The content of the comment.
  content: { type: String },
  // The signed in user who creates the comment.
  username: {
   type: String,
   required: true
  }
});

/**
 *  CommentModel
 */
const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;