import express from 'express';
import blogPostController from '../controllers/blogPostController';
import jwt from '../config/jwt';

const router = express.Router();

router.route('/')
    /** 
     *  GET /api/blog_posts - Get list of posts 
     */
    .get(blogPostController.list)

    /** 
     * POST /api/blog_posts - Create new post 
     */
    .post(jwt.validateJWT, blogPostController.create);

router.route('/:id')
    /** 
      * GET /api/blog_posts/:userId - Get post 
      */
    .get(blogPostController.get)

    /** 
     * PUT /api/blog_posts - Update a post 
     * make sure the user making the request
     * is the creator of the blog post
     */
    .put(jwt.validateJWT, blogPostController.validateUser, blogPostController.update)

    /** 
     * PATCH /api/blog_posts - Update a post 
     * make sure the user making the request
     * is the creator of the blog post
     */
    .patch(jwt.validateJWT, blogPostController.validateUser, blogPostController.update)

    /** 
     * DELETE /api/blog_posts - Delete a post 
     * make sure the user making the request
     * is the creator of the blog post
     */
    .delete(jwt.validateJWT, blogPostController.validateUser, blogPostController.remove);


// Load blog post when API with id route parameter is hit 
router.param('id', blogPostController.load);

export default router;