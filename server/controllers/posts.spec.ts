import * as faker from 'faker';
import { Response, Request } from 'express';
import { database } from '../db';

import {
  getPostsSuggested,
  getPostComments,
  getPostLikes,
  getMyPosts,
  getPostsFollowing,
  getPostById,
  createPost,
  createPostComment,
  createPostLike,
  deletePost
} from './posts';
import {
  getAllFolloweeIds,
  getAllFollowerIds
} from '../data/follows';
import { getUserById } from '../data/users';
import { getPhotoById, getPhotosInUserIds } from '../data/photos';
import { getCommentsByPhotoId } from '../data/comments';
import { getLikesByPhotoId } from '../data/likes';



describe('Post Controller', () => {
  let user;
  let followee_ids;
  let follower_ids;



  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 25, tags: 35 });
    user = await getUserById(1);
    followee_ids = await getAllFolloweeIds(user.id);
    follower_ids = await getAllFollowerIds(user.id);
    session.user = user;
  });
  afterAll(async () => {
    await database.disconnect();
  });

  const session: Partial<Express.Session> = {};
  const req: Partial<Request> = {};
  const res: Partial<Response> = {};
  const json = jest.fn();
  const status = jest.fn();

  afterEach(() => {
    json.mockRestore();
    status.mockRestore();
  });

  beforeEach(() => {
    json.mockReturnThis();
    status.mockReturnThis();
  });





  it('can getPostsFollowing()', async () => {
    const query = { limit: 10, offset: 0 };
    const request = Object.assign(req, { session, query, followee_ids });
    const response = Object.assign(res, { json, status });
    await getPostsFollowing(<Request>request, <Response>response);
    expect(response.json).toHaveBeenCalledTimes(1);
    response.json.mock.calls.forEach(async (call) => {
      const { data, count } = call[0];
      expect(data.length).toBeLessThanOrEqual(count);
      if (data.length) {
        const post = data[0];
        const comments = await getCommentsByPhotoId(post.id);
        expect(post.comments.count).toEqual(comments.count);
      }


    });


  });

  it('can getPostComments()', async () => {

    const params = { id: 1 };
    const query = { limit: 10, offset: 0 };
    const request = Object.assign(req, { params, query });
    const response = Object.assign(res, { json, status });
    await getPostComments(<Request>request, <Response>response);
    const comments = await getCommentsByPhotoId(params.id);
    expect(response.json).toHaveBeenCalledTimes(1);
    response.json.mock.calls.forEach(call => {
      const { data, count } = call[0];
      expect(data.length).toBeLessThanOrEqual(count);
      expect(count).toEqual(comments.count);

    });

  });

  it('can getPostLikes()', async () => {

    const params = { id: 1 };
    const query = { limit: 20, offset: 0 };
    const request = Object.assign(req, { params, query });
    const response = Object.assign(res, { json, status });
    await getPostLikes(<Request>request, <Response>response);
    const likes = await getLikesByPhotoId(params.id);
    expect(response.json).toHaveBeenCalledTimes(1);
    const [{ data, count }] = response.json.mock.calls[0];
    expect(data.length).toBeLessThanOrEqual(count);
    expect(count).toEqual(likes.count);
  });

  it('can getPostsSuggested()', async () => {

    const query = { limit: 10, offset: 0 };
    const request = Object.assign(req, { query, session, followee_ids });
    const response = Object.assign(res, { json, status });
    await getPostsSuggested(<Request>request, <Response>response);
    expect(response.json).toHaveBeenCalledTimes(1);
    response.json.mock.calls.forEach(call => {
      const { data, count } = call[0];
      expect(data.length).toBeLessThanOrEqual(count);

    });
  });

  it('can getMyPosts()', async () => {

    const query = { limit: 10, offset: 0 };
    const request = Object.assign(req, { query, session });
    const response = Object.assign(res, { json, status });
    await getMyPosts(<Request>request, <Response>response);
    expect(response.json).toHaveBeenCalledTimes(1);
    response.json.mock.calls.forEach(call => {
      const { data, count } = call[0];
      if (count) {
        expect(data[0].username).toContain(user.username);
      }

    });
  });

  it('can getPostById()', async () => {

    const params = { id: 1 };
    const request = Object.assign(req, { params });
    const response = Object.assign(res, { json, status });
    await getPostById(<Request>request, <Response>response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledTimes(1);




  });

  it('can createPost()', async () => {

    const image_url = faker.image.image();
    const tag_names = ['one', 'two', 'three', 'four'];
    const body = { image_url, tag_names };
    const request = Object.assign(req, { session, body });
    const response = Object.assign(res, { json, status });
    await createPost(<Request>request, <Response>response);
    expect(response.json).toHaveBeenCalledTimes(1);
    response.json.mock.calls.forEach(call => {

      const post = call[0];
      expect(post.avatar).toBeTruthy();
      expect(post.created_at).toBeTruthy();
      expect(post.id).toBeTruthy();
      expect(post.image_url).toBeTruthy();
      expect(post.username).toBeTruthy();

    });

  });

  it('can createPostComment()', async () => {


    const comment_text = 'random comment text';
    const params = { id: 1 };
    const body = { comment_text };
    const request = Object.assign(req, { session, body, params });
    const response = Object.assign(res, { json, status });
    await createPostComment(<Request>request, <Response>response);
    expect(response.json).toHaveBeenCalledTimes(1);
    const [ postComment ] = response.json.mock.calls[0];
    expect(postComment.comment_text).toContain(comment_text);

  });

  it('can createPostLike()', async () => {

    const photo_id = 5;
    const params = { id: photo_id };
    const request = Object.assign(req, { session, params });
    const response = Object.assign(res, { json, status });
    try {
      await createPostLike(<Request>request, <Response>response);
      expect(response.json).toHaveBeenCalledTimes(1);
      const [postLike] = response.json.mock.calls[0];
      expect(postLike.affectedRows).toEqual(1);
    } catch (error) {
      expect(error.sqlMessage).toContain('Duplicate');
    }

  });

  it('can deletePost()', async () => {

    const photos = await getPhotosInUserIds([user.id]);
    const params = { id: photos.data[0].id };
    const request = Object.assign(req, { session, params });
    const response = Object.assign(res, { json, status });
    await deletePost(<Request>request, <Response>response);
    expect(response.json).toHaveBeenCalledTimes(1);
    const [ deleted ] = response.json.mock.calls[0];
    expect(deleted.affectedRows).toEqual(1);

  });



});
