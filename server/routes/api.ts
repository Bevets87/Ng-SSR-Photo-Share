import * as express from 'express';
import { usersRouter } from './users';
import { postsRouter } from './posts';
import { tagsRouter } from './tags';
import { meRouter } from './me';




const router = express.Router();

router.use('/me', meRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/tags', tagsRouter);




export const apiRouter = router;


