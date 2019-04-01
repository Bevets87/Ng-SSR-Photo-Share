import * as express from 'express';
import { searchUsers, getUserProfileById, getUsersFollowers, getUsersFollowing } from '../controllers/users';

import {
  searchValidations, paginationValidations
} from '../validation/query';
import { paramsValidations } from '../validation/params';

import {
  getUserFolloweeIds, getUserFollowerIds
} from '../controllers/follows';

const router = express.Router();

router.route('/profile/:id')
.get([ ...paramsValidations, getUserProfileById]);

router.route('/profile/:id/following')
  .get([...paginationValidations, ...paramsValidations, getUserFolloweeIds, getUsersFollowing]);
router.route('/profile/:id/followers')
  .get([...paginationValidations, ...paramsValidations, getUserFollowerIds, getUsersFollowers]);


router.route('/search')
.get([ ...searchValidations, searchUsers ]);



export const usersRouter = router;
