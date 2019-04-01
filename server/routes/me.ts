import * as express from 'express';
import { userValidations, followUserValidations, changePasswordValidations } from '../validation/users';
import { paramsValidations } from '../validation/params';
import { paginationValidations } from '../validation/query';
import { getMe, updateMe, deleteMe, getUsersFollowers, getUsersFollowing, getUsersSuggested, changePassword } from '../controllers/users';
import { createFollowUser, deleteFollowUser, getSessionFolloweeIds, getSessionFollowerIds } from '../controllers/follows';
import { getPostsFollowing, getMyPosts, getPostsSuggested, deletePost, deletePostLike } from '../controllers/posts';

const router = express.Router();

router.route('/')
  .get(getMe)
  .post([...userValidations, updateMe]);

router.route('/:id')
  .delete([...paramsValidations, deleteMe]);

router.route('/change-password')
  .post([...changePasswordValidations, changePassword]);

router.route('/following')
  .post([...followUserValidations, createFollowUser]);
router.route('/following/:id')
  .delete([ ...paramsValidations, deleteFollowUser]);

router.route('/posts')
  .get([...paginationValidations, getMyPosts]);
router.route('/posts/:id')
  .delete([...paramsValidations, deletePost]);
router.route('/posts/suggested')
  .get([...paginationValidations, getSessionFolloweeIds, getPostsSuggested]);
router.route('/posts/following')
  .get([...paginationValidations, getSessionFolloweeIds, getPostsFollowing]);

router.route('/likes/:id')
  .delete([ ...paramsValidations, deletePostLike]);

router.route('/users/suggested')
  .get([...paginationValidations, getSessionFolloweeIds, getUsersSuggested]);

export const meRouter = router;
