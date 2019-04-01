import { Response, Request } from 'express';
import { database } from '../db';
import { getUserById } from '../data/users';
import {
  searchTags
} from './tags';



describe('Tags Controller', () => {

  let user;




  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 25, tags: 35 });
    user = await getUserById(1);
    session.user = user;



  });
  afterAll(async () => {
    await database.disconnect();
  });


  const session: Partial<Express.Session> = {};
  const request: Partial<Request> = {};
  const response: Partial<Response> = {};
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


  it('can search tags by tag_name', async () => {
    const q = 'f';
    const query = { q };
    const req = Object.assign(request, { session, query });
    const res = Object.assign(response, { json, status });
    await searchTags(<Request>req, <Response>res);
    expect(res.status).toHaveBeenCalledWith(200);
    const [ results ] = res.json.mock.calls[0];

    if (results.length) {
      const result = results[0];
      expect(result.id).toBeTruthy();
      expect(result.posts).toBeTruthy();
      expect(result.tag_name).toBeTruthy();
    }
  });

});
