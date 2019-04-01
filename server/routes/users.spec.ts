import * as session from 'supertest-session';
import { database } from '../db';
import { setupTestServer } from '../utils/test-utils';
describe('User Router', () => {

  let authSession;
  beforeAll(async () => {
    const server = setupTestServer();
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


  it('can GET /api/users/search', async () => {
    const q = 'test';
    const response = await authSession.get(`/api/users/search?q=${q}`);
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(20);

  });



});
