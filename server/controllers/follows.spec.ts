import * as faker from 'faker';
import { Response, Request } from 'express';
import { database } from '../db';
import { getUserById } from '../data/users';
import {
  getSessionFolloweeIds,
  getSessionFollowerIds,
  createFollowUser,
  deleteFollowUser
} from './follows';




describe('Follows Controller', () => {

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
  const next = jest.fn();

  afterEach(() => {
    json.mockRestore();
    status.mockRestore();
    next.mockRestore();
  });

  beforeEach(() => {
    json.mockReturnThis();
    status.mockReturnThis();
  });


  it('can getSessionFollowerIds()', async () => {
    const req = Object.assign(request, { session });
    const res = Object.assign(response, { json, status });
    await getSessionFollowerIds(<Request>req, <Response>res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req['follower_ids']).toBeTruthy();
  });

  it('can getSessionFolloweeIds()', async () => {
    const req = Object.assign(request, { session });
    const res = Object.assign(response, { json, status });
    await getSessionFolloweeIds(<Request>req, <Response>res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req['followee_ids']).toBeTruthy();
  });

  it('can createFollowUser()', async () => {
    const followee_id = 25;
    const body = { followee_id };
    const req = Object.assign(request, { session, body });
    const res = Object.assign(response, { json, status });
    await createFollowUser(<Request>req, <Response>res);
    const [ code ] = res.status.mock.calls[0];
    const [ result] = res.json.mock.calls[0];
    if (code === 200) {
      expect(result.affectedRows).toEqual(1);
    }
  });

  it('can deleteFollowUser()', async () => {
    const followee_id = 25;
    const params = { id: followee_id };
    const req = Object.assign(request, { session, params });
    const res = Object.assign(response, { json, status });
    await deleteFollowUser(<Request>req, <Response>res);
    const [code] = res.status.mock.calls[0];
    const [result] = res.json.mock.calls[0];
    if (code === 200) {
      expect(result.affectedRows).toEqual(1);
    }
  });


});
