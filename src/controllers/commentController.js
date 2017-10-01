import uuidv4 from 'uuid/v4';
import httpStatus from 'http-status';
import CommentModel from '../models/CommentModel';
import BlogPostModel from '../models/BlogPostModel';
import APIError from '../helpers/APIError';
import config from '../config/main';

/**
 * Create new comment
 * @property {string} req.body.blog_post_id - The id of blog post the comment belongs to.
 * @property {string} req.body.content - The content of the comment.
 * @property {string} req.body.username - The signed in user who creates the comment.
 * @returns {BlogPostModel}
 */
function create(req, res, next) {
  // if no user token --> return partial content error
  let error = new APIError('No username in the token.', httpStatus.PARTIAL_CONTENT);
  if(!req.token || !req.token[config.auth0.username_claim]) return next(error);

  const comment = new CommentModel({
    uuid: uuidv4(), //generate uuid string
    blog_post_id: req.body.blog_post_id,
    content: req.body.content,
    username: req.token[config.auth0.username_claim]
  });

  comment.save()
    .then(
        commment => {
            BlogPostModel.get(req.body.blog_post_id)
            .then(blog_post => {
                blog_post.comments.push(comment._id);
                blog_post.save()
                  .then(blog_post => res.json(comment))
                  .catch(error => next(error));
            })
            .catch(error => next(error));
        }
    ) 
    .catch(error => next(error));
}


/**
 * Delete comment.
 * @returns {StatusObject}
 */
function remove(req, res, next) {
  CommentModel.remove({_id: req.params.id})
    .then(status => res.json(status))
    .catch(error => next(error));
}

export default { create, remove };