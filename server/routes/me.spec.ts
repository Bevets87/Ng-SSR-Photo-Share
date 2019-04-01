import * as session from 'supertest-session';
import * as faker from 'faker';
import { database } from '../db';
import { setupTestServer } from '../utils/test-utils';
import { getLikesByUserId } from '../data/likes';
import { getAllFolloweeIds } from '../data/follows';
import { getPhotosByUserId } from '../data/photos';
import { getUserByUsername } from '../data/users';


describe('Me Router', () => {
  let authSession;
  beforeAll(async () => {
    const server =  setupTestServer();
    await database.connect();
    await database.setup();
    await database.seed({ users: 25, tags: 10 });
    const testSession = session(server);
    const response = await testSession.post('/auth/login').send({
      username: 'test-1@test.com',
      password: 'password-1'
    });
    expect(response.status).toEqual(200);
    authSession = testSession;

  });

  afterAll(async () => {
    await database.disconnect();
    const response = await authSession.post('/auth/logout');
    expect(response.status).toEqual(200);
  });

  it('GET /api/me', async () => {
    const response = await authSession.get('/api/me');

    expect(response.status).toEqual(200);

  });

  it('GET /api/me/posts', async () => {
    const response = await authSession.get(`/api/me/posts?limit=${10}&offset=${0}`);
    const posts = response.body;
    expect(response.status).toEqual(200);
    if (posts.count) {
      const post = posts.data[0];
      expect(typeof post.comments).toEqual('number');
    }

  });

  it('GET /api/me/posts/suggested', async () => {
    const response = await authSession.get(`/api/me/posts/suggested?limit=${10}&offset=${0}`);
    const posts = response.body;
    expect(response.status).toEqual(200);
    if (posts.count) {
      const post = posts.data[0];
      expect(typeof post.comments).toEqual('number');
    }

  });

  it('GET /api/me/posts/following', async () => {
    const response = await authSession.get(`/api/me/posts/following?limit=${10}&offset=${0}`);
    const posts = response.body;
    expect(response.status).toEqual(200);
    if (posts.count) {
      const post = posts.data[0];

      expect(post.is_followee).toBeTruthy();
    }
  });

  it('GET /api/me/users/following', async () => {
    const response = await authSession.get(`/api/me/users/following?limit=${10}&offset=${0}`);
    const users = response.body;
    expect(response.status).toEqual(200);
    if (users.count) {
      const user = users.data[0];
      expect(user.is_followee).toBeTruthy();
    }
  });

  it('GET /api/me/users/followers', async () => {
    const response = await authSession.get(`/api/me/users/followers?limit=${10}&offset=${0}`);
    const users = response.body;
    expect(response.status).toEqual(200);
    if (users.count) {
      const user = users.data[0];
      expect(user.is_follower).toBeTruthy();
    }
  });

  it('GET /api/me/users/suggested', async () => {
    const response = await authSession.get(`/api/me/users/suggested?limit=${10}&offset=${0}`);
    const users = response.body;
    expect(response.status).toEqual(200);
    if (users.count) {
      const user = users.data[0];
      expect(user.is_followee).toBeFalsy();
    }
  });


  it('POST /api/me', async () => {
    const avatar = faker.internet.avatar();
    const username = 'test-1@test.com';
    const response = await authSession.post('/api/me')
    .send({ username, avatar });

    expect(response.status).toEqual(200);
    expect(response.body.affectedRows).toEqual(1);
  });

  it('POST /api/me/following', async () => {
    const followee_id = 25;
    const body = { followee_id };
    const response = await authSession.post('/api/me/following')
    .send(body);

    expect(response.status).toEqual(200);
    expect(response.body.affectedRows).toEqual(1);
  });

  it('DELETE /api/me/likes/:id', async () => {
    const likes = await getLikesByUserId(1, { limit: 10, offset: 0 });
    if (likes.count) {
      const like = likes.data[0];
      const response = await authSession.delete(`/api/me/likes/${like.photo_id}`);

      expect(response.status).toEqual(200);
    }

  });

  it('DELETE /api/me/following/:id', async () => {
    const followee_ids = await getAllFolloweeIds(1);
    if (followee_ids.length) {
      const followee_id = followee_ids[0];
      const response = await authSession.delete(`/api/me/following/${followee_id}`);
      expect(response.status).toEqual(200);
    }

  });

  it('DELETE /api/me/posts/:id', async () => {
    const photos = await getPhotosByUserId(1, { limit: 10, offset: 0 });
    if (photos.count) {
      const photo = photos.data[0];
      const response = await authSession.delete(`/api/me/posts/${photo.id}`);
      expect(response.status).toEqual(200);
    }
  });

  it('DELETE /api/me/:id', async () => {
    const user = await getUserByUsername('test-1@test.com');
    const response = await authSession.delete(`/api/me/${user.id}`);
    expect(response.status).toEqual(200);
  });


});
