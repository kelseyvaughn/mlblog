import express from 'express';
import blogPostRoutes from './blogPostRoutes';
import commentRoutes from './commentRoutes';

const router = express.Router();

// mount post routes on /posts
router.use('/blog_posts', blogPostRoutes);

// mount comment routes on /comments
router.use('/comments', commentRoutes);

export default router;