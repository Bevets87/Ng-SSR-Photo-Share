import * as request from 'supertest';
import { database } from '../db';
import { setupTestServer } from '../utils/test-utils';


describe('Auth Router', () => {

  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 10, tags: 10 });


  });

  afterAll(async () => {
    await database.disconnect();
  });

  const server = setupTestServer();







  it('can POST /auth/register and succeed', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send({
        username: 'test-11@test.com',
        password: 'password-11',
        password_confirmation: 'password-11'
      });

    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('test-11@test.com');
  });

  it('can POST /auth/register and fail', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send({
        username: 'test-12@test.com',
        password: '1234',
        password_confirmation: 'password'
      });
    expect(response.status).toEqual(400);
    expect(response.body.message).toContain('password must be atleast 8 characters long');

  });

  it('can POST /auth/login and succeed', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({
        username: 'test-11@test.com',
        password: 'password-11',
      });

    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('test-11@test.com');
  });

  it('can POST /auth/login and fail', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({
        username: 'test-2@test.com',
        password: 'password-1'
      });
    expect(response.status).toEqual(400);
    expect(response.body.message).toContain('invalid username or password');

  });

  it('can POST /auth/logout', async () => {
    const response1 = await request(server)
    .post('/auth/logout');

    const response2 = await request(server)
      .post('/auth/logout');

    const response3 = await request(server)
      .post('/auth/logout');

    const response4 = await request(server)
      .post('/auth/logout');

    expect(response1.status).toEqual(200);
    expect(response1.body.ok).toBeTruthy();
    expect(response2.status).toEqual(200);
    expect(response2.body.ok).toBeTruthy();
    expect(response3.status).toEqual(200);
    expect(response3.body.ok).toBeTruthy();
    expect(response4.status).toEqual(200);
    expect(response4.body.ok).toBeTruthy();
  });




});
