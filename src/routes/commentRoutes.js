import express from 'express';
import commentController from '../controllers/commentController';
import jwt from '../config/jwt';

const router = express.Router();

router.route('/')
    /** 
    * POST /api/comments - Create new comment 
    */
    .post(jwt.validateJWT, commentController.create);

export default router;