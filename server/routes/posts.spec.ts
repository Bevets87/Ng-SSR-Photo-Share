import * as session from 'supertest-session';
import * as faker from 'faker';
import { database } from '../db';
import { setupTestServer } from '../utils/test-utils';



describe('Post Router', () => {
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



  it('can GET /api/posts/:id', async () => {

    const response = await authSession.get(`/api/posts/${1}`);
    const post = response.body;
    expect(response.status).toEqual(200);
    expect(post.id).toBeTruthy();
    expect(post.comments).toBeTruthy();
    expect(post.username).toBeTruthy();
    expect(post.avatar).toBeTruthy();
    expect(post.tags).toBeTruthy();
    expect(typeof post.likes).toContain('number');
    expect(typeof post.is_followee).toContain('boolean');
    expect(typeof post.is_me).toContain('boolean');
    expect(typeof post.me_likes).toContain('boolean');
  });


  it('can GET /api/posts/:id/comments', async () => {

    const response = await authSession.get(`/api/posts/1/comments?limit=${10}&offset=${0}`);
    expect(response.status).toEqual(200);
    if (response.body.count) {
      const comment = response.body.data[0];
      expect(comment.comment_text).toBeTruthy();

    }
  });

  it('can GET /api/posts/:id/likes', async () => {

    const response = await authSession.get(`/api/posts/1/likes?limit=${10}&offset=${0}`);
    expect(response.status).toEqual(200);
    if (response.body.count) {
      const likes = response.body.data[0];
      expect(likes.username).toBeTruthy();
      expect(likes.avatar).toBeTruthy();
    }
  });



  it('can POST /api/posts', async () => {
    const tag_names = [];
    for (let i = 0; i < 5; i++) {
      tag_names.push(faker.lorem.word());
    }
    const post = {
      image_url: faker.image.image(), tag_names
    };
    const response = await authSession.post(`/api/posts`)
      .send(post);

    expect(response.status).toEqual(200);
    expect(response.body.username).toContain('test-1@test.com');

  });

  it('can POST /api/posts/:id/comments', async () => {

    const comment = {
      comment_text: faker.lorem.sentences()
    };
    const response = await authSession.post(`/api/posts/10/comments`)
      .send(comment);

    expect(response.status).toEqual(200);
    expect(response.body.username).toContain('test-1@test.com');
  });

  it('can POST /api/posts/:id/likes', async () => {
    const response = await authSession.post(`/api/posts/10/likes`);
    expect(response.status).toEqual(200);
    expect(response.body.affectedRows).toEqual(1);

  });




});
