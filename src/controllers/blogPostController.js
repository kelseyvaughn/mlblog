import uuidv4 from 'uuid/v4';
import httpStatus from 'http-status';
import BlogPostModel from '../models/BlogPostModel';
import APIError from '../helpers/APIError';
import config from '../config/main';

/** Load post and append to req */
function load(req, res, next, id) {
  BlogPostModel.get(id)
    .then((blog_post) => {
      req.blog_post = blog_post;
      return next();
    })
    .catch(error => next(error));
}

/**
 * Get post
 * @returns {BlogPostModel}
 */
function get(req, res) {
  return res.json(req.blog_post);
}

/**
 * Create new blog post
 * @property {string} req.body.title - The title of the blog post.
 * @property {string} req.body.content - The content of the blog post.
 * @property {string} req.body.username - The signed in user who creates the post.
 * @returns {BlogPostModel}
 */
function create(req, res, next) {
  // if no user token --> return partial content error
  let error = new APIError('No username in the token.', httpStatus.PARTIAL_CONTENT);
  if(!req.token || !req.token[config.auth0.username_claim]) return next(error);

  const blog_post = new BlogPostModel({
    uuid: uuidv4(), //generate uuid string
    title: req.body.title,
    content: req.body.content,
    username: req.token[config.auth0.username_claim]
  });

  blog_post.save()
    .then(blog_post => res.json(blog_post))
    .catch(error => next(error));
}

/**
 * Update a blog post
 * @property {string} req.body.title - The title of the blog post.
 * @property {string} req.body.content - The content of blog post.
 * @property {string} req.body.username - The signed in user who creates the post.
 * @returns {BlogPostModel}
 */
function update(req, res, next) {
  //will use the findOneAndUpdate method of the model 
  BlogPostModel.findOneAndUpdate({_id:req.params.id}, req.body, {new: true})
    .then(blog_post => res.json(blog_post))
    .catch(error => next(error));
}

/**
 * Get list of blog posts.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {BlogPostModel[]}
 */
function list(req, res, next) {
  const { skip_num = 0, limit_num = 50 } = req.query;
  BlogPostModel.list({ skip_num, limit_num })
    .then(blog_posts => res.json(blog_posts))
    .catch(error => next(error));
}

/**
 * Delete blog post.
 * @returns {StatusObject}
 */
function remove(req, res, next) {
  BlogPostModel.remove({_id: req.params.id})
    .then(status => res.json(status))
    .catch(error => next(error));
}

/** validate blog post creator/user againt requesting user */
function validateUser(req, res, next){
    // check the user_id in the token
    // against the user_id of the user
    // who cretaed the blog post
    // if no user token --> return authentication error
    let error = new APIError('User must be the creator of the blog post to modify it.', httpStatus.UNAUTHORIZED);
    if(!req.token || !req.token[config.auth0.username_claim]) return next(error);
                 
    // get the blog post by the id in the params of the url                  
    BlogPostModel.get(req.params.id)
      .then((blog_post) => {
        if(blog_post.username !== req.token[config.auth0.username_claim]) return next(error);
        return next();
      })
      .catch(error => next(error));
}

export default { load, get, create, update, list, remove, validateUser };

