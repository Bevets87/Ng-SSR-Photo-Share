import { Request, Response, NextFunction } from 'express';
import {
  createFollow,
  removeFollow,
  getAllFolloweeIds,
  getAllFollowerIds
} from '../data/follows';

export const createFollowUser = async (req: Request, res: Response) => {
  try {
    const follower_id = req.session.user.id;
    const followee_id = req.body.followee_id;
    if (follower_id !== followee_id) {
      const response = await createFollow({ followee_id, follower_id });
      res.status(200).json(response);
    } else {
      res.status(400).json({ message: 'unable to follow yourself' });
    }
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to create follow' });
  }
};

export const deleteFollowUser = async (req: Request, res: Response) => {
  try {
    const follower_id = req.session.user.id;
    const followee_id = req.params.id;
    const removed = await removeFollow(follower_id, followee_id);
    res.status(200).json(removed);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to unfollow user' });
  }
};

export const getUserFolloweeIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ids = await getAllFolloweeIds(req.params.id);
    req['followee_ids'] = ids;
    next();
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get followee ids' });
  }
};



export const getSessionFolloweeIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ids = await getAllFolloweeIds(req.session.user.id);
    req['followee_ids'] = ids;
    next();
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get followee ids' });
  }
};

export const getSessionFollowerIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ids = await getAllFollowerIds(req.session.user.id);
    req['follower_ids'] = ids;
    next();
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get follower ids' });
  }
};

export const getUserFollowerIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ids = await getAllFollowerIds(req.params.id);
    req['follower_ids'] = ids;
    next();
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get follower ids' });
  }
};
