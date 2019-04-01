import {
  Request,
  Response
} from 'express';
import {
  getPhotosInUserIds,
  getPhotosByUserId,
  getPhotosNotInUserIds,
  getPhotoById,
  createPhoto,
  deletePhoto
} from '../data/photos';
import {
  getUserFollows
} from '../data/follows';
import {
  getCommentsCountByPhotoId,
  getCommentsByPhotoId,
  createComment
} from '../data/comments';
import {
  getPhotoTagsByPhotoId,
  getPhotosByTagId,
  createPhotoTag
} from '../data/photo-tags';
import {
  createManyTags,
  getTagByTagName,
  Tag
} from '../data/tags';
import {
  getLikesCountByPhotoId,
  createLike,
  getLikesByPhotoId,
  getUserLikes,
  removeLike
} from '../data/likes';
import {
  getUserById
} from '../data/users';


export const _getUser = (photo) => {
  return getUserById(photo.user_id);
};

export const _getComments = (photo) => {
  return getCommentsByPhotoId(photo.id);

};

export const _getCommentsCount = (photo) => {
  return getCommentsCountByPhotoId(photo.id);

};

export const _getLikesCount = (photo) => {
  return getLikesCountByPhotoId(photo.id);
};

export const _getTags = (photo) => {
  return getPhotoTagsByPhotoId(photo.id);

};

export const _getMeLikes = (me, photo) => {
  return getUserLikes(me.id, photo.id);

};

export const _getIsFollowee = (me, photo) => {
  return getUserFollows(me.id, photo.user_id);

};

export const _mapPostData = (me, photo) => {
  return Promise.all([
    _getComments(photo),
    _getLikesCount(photo),
    _getTags(photo),
    _getMeLikes(me, photo),
    me.id === photo.user_id ? Promise.resolve(false) : _getIsFollowee(me, photo)
  ])
  .then(([comments, likes, tags, me_likes, is_followee]) => Promise.resolve({
    ...photo, comments, likes, tags, me_likes, is_followee, is_me: me.id === photo.user_id
  }));
};

export const _mapShortPostData = (photo) => {
  return Promise.all([
    _getCommentsCount(photo),
    _getLikesCount(photo)
  ])
  .then(([ comments, likes ]) => Promise.resolve({ ...photo, comments, likes }));
};

export const _mapTagPostData = (photo) => {
  return Promise.all([
    _getCommentsCount({ id: photo.photo_id }),
    _getLikesCount({ id: photo.photo_id }),
    _getUser(photo)
  ])
  .then(([ comments, likes, user ]) => Promise.resolve({
    id: photo.photo_id,
    created_at: photo.created_at,
    comments,
    likes,
    user_id: photo.user_id,
    username: user.username,
    avatar: user.avatar,
    image_url: photo.image_url
  }));
};



export const _createPost = (req: Request) => {
  const photo = {
    user_id: req.session.user.id,
    image_url: req.body.image_url
  };
  const tag_names = req.body.tag_names;
  if (tag_names.length > 0) {
    return Promise.all([
      createPhoto(photo),
      createManyTags(tag_names)
    ])
    .then(async ([p, t]) => {
      const tags = await Promise.all(tag_names.map((tag_name) => getTagByTagName(tag_name)));
      await Promise.all(tags.map(([tag]) => tag).map((tag: Tag) => createPhotoTag({ tag_id: tag.id, photo_id: p.id })));
      return Promise.resolve(p);
    });
  } else {
    return createPhoto(photo);
  }
};
export const getPostComments = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const comments = await getCommentsByPhotoId(id, { limit: req.query.limit, offset: req.query.offset });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unbable to get comments' });
  }

};

export const getPostLikes = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const likes = await getLikesByPhotoId(id, { limit: req.query.limit, offset: req.query.offset });
    res.status(200).json(likes);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get users' });
  }

};
export const getPostById = async (req: Request, res: Response) => {
  const me = req.session.user;
  try {
    const photo = await getPhotoById(req.params.id);
    const post = await _mapPostData(me, photo);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get post' });
  }

};
export const createPost = async (req: Request, res: Response) => {
  try {
    const response = await _createPost(req);
    res.status(200).json({ ...response, comments: 0, likes: 0 });
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to create post' });
  }
};
export const createPostComment = async (req: Request, res: Response) => {
  try {
    const user_id = req.session.user.id;
    const comment_text = req.body.comment_text;
    const photo_id = req.params.id;
    const response = await createComment({ user_id, comment_text, photo_id });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to create comment' });
  }
};
export const createPostLike = async (req: Request, res: Response) => {
  try {
    const user_id = req.session.user.id;
    const photo_id = req.params.id;
    const response = await createLike({ user_id, photo_id });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to like' });
  }

};
export const deletePostLike = async (req: Request, res: Response) => {
  try {
    const user_id = req.session.user.id;
    const photo_id = req.params.id;
    const response = await removeLike(user_id, photo_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to delete like' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const response = await deletePhoto(req.params.id, req.session.user.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to delete post' });
  }

};


export const getPostsSuggested = async (req: Request, res: Response) => {
  const ids: number[] = req['followee_ids'];
  const me = req.session.user;
  ids.push(me.id);
  try {
    const photos = await getPhotosNotInUserIds(ids, { limit: req.query.limit, offset: req.query.offset });
    const response = await Promise.all(photos.data.map(photo => _mapShortPostData(photo)));
    res.status(200).json({ data: response, count: photos.count });
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get suggested posts' });
  }
};

export const getPostsFollowing = async (req: Request, res: Response) => {
  const ids: number[] = req['followee_ids'];
  const me = req.session.user;
  try {
    if (ids.length) {
      const photos = await getPhotosInUserIds(ids, { limit: req.query.limit, offset: req.query.offset });
      const response = await Promise.all(photos.data.map(photo => _mapPostData(me, photo)));
      res.status(200).json({ data: response, count: photos.count });
    } else {
      res.status(200).json({ data: [], count: 0 });
    }
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get posts followed' });
  }
};

export const getMyPosts = async (req: Request, res: Response) => {
  const me = req.session.user;
  try {
    const photos = await getPhotosByUserId(me.id, { limit: req.query.limit, offset: req.query.offset });
    const response = await Promise.all(photos.data.map(photo => _mapShortPostData(photo)));
    res.status(200).json({ data: response, count: photos.count });
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get your posts' });
  }
};

export const getPostTags = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const response = await getPhotoTagsByPhotoId(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get post tags' });
  }
};

export const getPostsByTagId = async (req: Request, res: Response) => {
  const tag_id = req.params.id;
  try {
    const photos = await getPhotosByTagId(tag_id, { limit: req.query.limit, offset: req.query.offset });
    const posts = await Promise.all(photos.data.map(photo => _mapTagPostData(photo)));

    if (photos.count) {
      const tag = { tag_name: photos.data[0].tag_name, id: photos.data[0].id };
      res.status(200).json({ tag, posts: { data: posts, count: photos.count } });
    } else {
      res.status(400).json({ message: 'unable to posts by tag id' });
    }

  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to get posts by tag id'});
  }
};



