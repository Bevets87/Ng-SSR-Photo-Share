import * as express from 'express';
import {
  getPostById,
  getPostComments,
  getPostLikes,
  createPost,
  createPostComment,
  createPostLike,
  getPostTags,
  getPostsByTagId
} from '../controllers/posts';

import {
  postValidations,
  postCommentValidations
} from '../validation/posts';

import { paginationValidations } from '../validation/query';
import { paramsValidations } from '../validation/params';

const router = express.Router();

router.route('/')
  .post([...postValidations, createPost]);
router.route('/:id')
  .get([...paramsValidations, getPostById]);
router.route('/:id/comments')
  .get([...paramsValidations, ...paginationValidations, getPostComments])
  .post([...paramsValidations, ...postCommentValidations, createPostComment]);
router.route('/:id/likes')
  .get([...paramsValidations, ...paginationValidations, getPostLikes])
  .post([...paramsValidations, createPostLike]);
router.route('/:id/tags')
  .get([...paramsValidations, getPostTags]);

router.route('/tags/:id')
.get([ ...paramsValidations, ...paginationValidations, getPostsByTagId ]);


export const postsRouter = router;

