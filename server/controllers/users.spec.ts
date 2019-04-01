import * as faker from 'faker';
import { Response, Request } from 'express';
import { database } from '../db';
import { getUserById } from '../data/users';
import {
  getMe,
  updateMe,
  deleteMe,
  getUsersFollowing,
  getUsersSuggested,
  getUsersFollowers
} from './users';

import {
  getAllFolloweeIds,
  getAllFollowerIds
} from '../data/follows';

describe('User Controller', () => {

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

  it('can getMe()', async () => {
    const request = Object.assign(req, { session });
    const response = Object.assign(res, { json, status });
    await getMe(<Request>request, <Response>response);
    expect(response.json).toHaveBeenCalledTimes(1);
  });

  it('can updateMe()', async () => {
    const username = faker.internet.userName();
    const avatar = faker.internet.avatar();
    const body = { username, avatar };
    const request = Object.assign(req, { session, body });
    const response = Object.assign(res, { json, status });
    await updateMe(<Request>request, <Response>response);
    expect(response.json).toHaveBeenCalledTimes(1);

  });



  it('can getUsersFollowing()', async () => {
    const query = { limit: 8, offset: 0 };
    const request = Object.assign(req, { session, query, followee_ids });
    const response = Object.assign(res, { json, status });
    await getUsersFollowing(<Request>request, <Response>response);
    const [ results ] = response.json.mock.calls[0];
    if (results.count) {
      const person = results.data[0];
      expect(person.is_followee).toBeTruthy();
    }


  });

  it('can getUsersSuggested()', async () => {
    const query = { limit: 14, offset: 0 };
    const request = Object.assign(req, { session, query, followee_ids });
    const response = Object.assign(res, { json, status });
    await getUsersSuggested(<Request>request, <Response>response);
    const [ results ] = response.json.mock.calls[0];
    if (results.count) {
      const suggestion = results.data[0];
      expect(suggestion.is_followee).toBeFalsy();
    }



  });

  it('can getUsersFollowers()', async () => {

    const query = { limit: 5, offset: 0 };
    const request = Object.assign(req, { session, query, follower_ids });
    const response = Object.assign(res, { json, status });
    await getUsersFollowers(<Request>request, <Response>response);
    const [followers] = response.json.mock.calls[0];
    if (followers.count) {
      const follower = followers.data[0];
      expect(follower.is_follower).toBeTruthy();
    }
  });




  it('can deleteMe()', async () => {
    const id = 1;
    const params = { id };
    const request = Object.assign(req, { session, params });
    const response = Object.assign(res, { json, status });
    await deleteMe(<Request>request, <Response>response);
    expect(response.json).toHaveBeenCalledTimes(1);
    const [result] = response.json.mock.calls[0];
    expect(result.affectedRows).toEqual(1);
  });

});
