import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 *  BlogPostSchema
 */
const BlogPostSchema = new mongoose.Schema({
  // ID of the blog post.
  uuid: {
    type: String,
    unique: true
  },
  // The date time stamp when the post was created.
  // set defult to now
  datetime: {
    type: String,
    default: (new Date()).toISOString(),
    required: true 
  },
  // Title of the blog post.
  title: {
    type: String,
    required: true
  },
  // The content of the blog post.
  content: { type: String },
  // The unique username of the signed in user who creates the post.
  username: { 
    type: String, 
    required: true 
  },
  // Collection of comments belonging to this post
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }]
});

/**
 *  BlogPostSchema static methods
 */
BlogPostSchema.statics = {
  /**
   * Get blog post
   * @param {id} id - The objectId of user.
   * @returns {Promise<BlogPost, APIError>}
   */
  get(id) {
    return this.findById(id)
        .exec()
        .then((blog_post) => {
          if (blog_post) {
            return blog_post;
          }
          let error = new APIError('No such blog post exists!', httpStatus.NOT_FOUND);
          return Promise.reject(error);
        });
  },
  /**
   * List blog posts
   * in descending order of 'datetime' timestamp.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<BlogPost[]>}
   */
  list({ skip_num = 0, limit_num = 50 } = {}) {
    return this.find()
        .populate({
          path: 'comments',
          select: 'uuid blog_post content username datetime',
          options: { sort: { datetime: -1 }}
        })
        .sort({ datetime: -1 })
        .skip(+skip_num)
        .limit(+limit_num)
        .exec();
  }
};

/**
 * BlogPostModel
 */
const BlogPostModel = mongoose.model('BlogPost', BlogPostSchema);

export default BlogPostModel;