import { Request, Response } from 'express';
import {
  getUsersNotInIds,
  getUsersInIds,
  searchUsersByUsername,
  getUserById,
  updateUser,
  deleteUser,
  changeUserPassword,
  User
} from '../data/users';
import {
  getUserFollows,
  getFollowersCount,
  getFollowingCount
} from '../data/follows';

import {
  getPhotosByUserId
} from '../data/photos';

import {
  _mapShortPostData
} from './posts';
import * as bcrypt from 'bcrypt';

export const _mapFollows = (me, user: User) => {
  const getIsFollowee = () => getUserFollows(me.id, user.id);
  const getIsFollower = () => getUserFollows(user.id, me.id);

  return Promise.all([getIsFollowee(), getIsFollower()])
  .then(([is_followee, is_follower]) => Promise.resolve({...user, is_followee, is_follower, is_me: me.id === user.id }));
};



export const _mapProfileData = (me, user) => {
  return Promise.all([
    getFollowersCount(user.id),
    getFollowingCount(user.id),
    getPhotosByUserId(user.id),
    _mapFollows(me, user)

  ])
    .then(async ([followers, following, photos, person]) => {
      const posts = await Promise.all(photos.data.map(photo => _mapShortPostData(photo)));
      return Promise.resolve({
        followers,
        following,
        photos: { data: posts, count: photos.count },
        id: person.id,
        username: person.username,
        avatar: person.avatar,
        is_followee: person.is_followee,
        is_follower: person.is_follower,
        is_me: me.id === user.id
      });
    });
};




export const getUsersSuggested = async (req: Request, res: Response) => {
  const ids = req['followee_ids'];
  const me = req.session.user;
  ids.push(me.id);
  try {
    const users = await getUsersNotInIds(ids, { limit: req.query.limit, offset: req.query.offset });
    const response = await Promise.all(users.data.map(user => _mapFollows(me, user)));

    res.status(200).json({ data: response, count: users.count });
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get suggested users' });
  }
};

export const getUsersFollowing = async (req: Request, res: Response) => {
  const ids = req['followee_ids'];
  const me = req.session.user;
  try {
    if (ids.length) {
      const users = await getUsersInIds(ids, { limit: req.query.limit, offset: req.query.offset });
      const response = await Promise.all(users.data.map(user => _mapFollows(me, user) ));
      res.status(200).json({ data: response, count: users.count });
    } else {
      res.status(200).json({ data: [], count: 0 });
    }
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get users following' });
  }
};

export const getUsersFollowers = async (req: Request, res: Response) => {
  const ids = req['follower_ids'];
  const me = req.session.user;
  try {
    if (ids.length) {
      const users = await getUsersInIds(ids, { limit: req.query.limit, offset: req.query.offset });
      const response = await Promise.all(users.data.map(user => _mapFollows(me, user) ));
      res.status(200).json({ data: response, count: users.count });
    } else {
      res.status(200).json({ data: [], count: 0 });
    }
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get followers' });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const users = await searchUsersByUsername(req.query);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to search users' });
  }
};


export const getMe = async (req: Request, res: Response) => {
  const me = await getUserById(req.session.user.id);
  res.status(200).json({ username: me.username, id: me.id, avatar: me.avatar });
};

export const updateMe = async (req: Request, res: Response) => {
  const username: string = req.body.username;
  const avatar: string = req.body.avatar;
  try {
    const updatedMe = await updateUser(req.session.user.id, { username, avatar });
    res.status(200).json(updatedMe);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to update user' });
  }
};

export const deleteMe = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const me = req.session.user;

  try {
    if (id === me.id) {
      const deletedMe = await deleteUser(req.session.user.id);
      res.status(200).json(deletedMe);
    } else {
      res.status(400).json({ message: 'id must match session id' });
    }


  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to delete user' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const me = await getUserById(req.session.user.id);
  const isValid = await bcrypt.compare(req.body.old_password, me.password);
  if (isValid) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(req.body.new_password, salt);
      const updated = await changeUserPassword(me.id, hashed_password);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ ...error, message: 'unable to change password' });
    }
  } else {
    res.status(400).json({ message: 'invalid password' });
  }




};

export const getUserProfileById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const me = req.session.user;
  try {
    const user = await getUserById(id);
    const profile = await _mapProfileData(me, user);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to obtain user profile' });
  }
};


