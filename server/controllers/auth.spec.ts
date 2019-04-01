import { Response, Request, NextFunction } from 'express';
import {
  createNewUser,
  authenticateRequest,
  logoutUser,
  hashPassword,
  isCorrectPassword,
  isNewUsername,
  getUserFromUsername
} from './auth';
import {
  getUserById
} from '../data/users';

import {
  database
} from '../db';

describe('Auth Controller', () => {
  let user;
  const session: Partial<Express.Session> = {};
  const req: Partial<Request> = {};
  const res: Partial<Response> = {};
  const next = jest.fn();
  const json = jest.fn();
  const status = jest.fn();
  const destroy = jest.fn();


  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 10, tags: 20 });
    user = await getUserById(1);


  });

  afterAll(async () => {
    await database.disconnect();
  });

  afterEach(() => {
    json.mockRestore();
    destroy.mockRestore();
    next.mockRestore();
    status.mockRestore();


  });

  it('can check if username is new and fail', async () => {
    json.mockReturnThis();
    status.mockReturnThis();
    const username = 'test-1@test.com';
    const password = 'password-1';
    const body = { username, password };
    const request = Object.assign(req, { body });
    const response = Object.assign(res, { json, status });
    await getUserFromUsername(<Request>request, <Response>response, <NextFunction>next);
    await isNewUsername(<Request>request, <Response>response, <NextFunction>next);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: 'username already exists' });
  });

  it('can check if username is new and next()', async () => {
    const username = 'test-11';
    const password = 'password';
    const body = { username, password };
    const request = Object.assign(req, { body });
    const response = Object.assign(res, { json, status });
    await getUserFromUsername(<Request>request, <Response>response, <NextFunction>next);
    await isNewUsername(<Request>request, <Response>response, <NextFunction>next);
    expect(next).toHaveBeenCalledTimes(2);

  });

  it('can hash a password', async () => {
    const password = 'password';
    const body = { password };
    const request = Object.assign(req, { body });
    const response = Object.assign(res, { json, status });
    await hashPassword(<Request>request, <Response>response, <NextFunction>next);
    expect(password.length).toBeLessThan(req.body.password.length);
    expect(next).toHaveBeenCalledTimes(1);

  });

  it('can check if password is correct when logging in and next()', async () => {
    json.mockReturnThis();
    status.mockReturnThis();
    const username = 'test-2';
    const password = 'password-2';
    const body = { username, password };
    const request = Object.assign(req, { body });
    const response = Object.assign(res, { json, status });
    await hashPassword(<Request>request, <Response>response, <NextFunction>next);
    await isCorrectPassword(<Request>request, <Response>response, <NextFunction>next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('can check if password is correct when logging in and fail', async () => {
    json.mockReturnThis();
    status.mockReturnThis();
    const username = 'test-2';
    const password = 'password-4';
    const body = { username, password };
    const request = Object.assign(req, { body });
    const response = Object.assign(res, { json, status });
    await isCorrectPassword(<Request>request, <Response>response, <NextFunction>next);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: 'invalid username or password'});
  });

  it('can createNewUser() and next()', async () => {
    const username = 'test-11';
    const password = 'password-11';
    const body = { username, password };
    const request = Object.assign(req, { body });
    const response = Object.assign(res, { json, status });
    await createNewUser(<Request>request, <Response>response, <NextFunction>next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req['user'].username).toContain(username);
  });

  it('can authenticateRequest()', async () => {
    json.mockReturnThis();
    status.mockReturnThis();
    const request = Object.assign(req, { user, session });
    const response = Object.assign(res, { json, status });
    expect(request.session.user).toBeFalsy();
    await authenticateRequest(<Request>request, <Response>response);
    expect(request.session.user).toBeTruthy();
    expect(request.session.user.id).toEqual(user.id);
    expect(request.session.authenticated).toBeTruthy();
  });

  it('can logoutUser()', async () => {
    const mockSession = Object.assign(session, { destroy });
    const request = Object.assign(req, { session: mockSession });
    const response = Object.assign(res, { json, status });
    await logoutUser(<Request>request, <Response>response);
    expect(mockSession.destroy).toHaveBeenCalledTimes(1);
  });





});
