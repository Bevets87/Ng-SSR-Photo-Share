import { database } from '../db';

import {
  createUser,
  updateUser,
  getUserById,
  searchUsersByUsername,
  getUserByUsername,
  deleteUser,
  getUsersNotInIds,
  getUsersInIds
} from './users';

import {
  getAllFollowerIds
} from './follows';

describe('Users Data', () => {

  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 10, tags: 20 });

  });

  afterAll(async () => {
    await database.disconnect();
  });

  it('can createUser()', async () => {
    const user = {
      username: 'Test',
      password: 'password',
      avatar: ''
    };
    const response = await createUser(user);
    expect(response).toEqual({ ...user, id: 11 });
  });

  it('can updateUser()', async () => {
    const update = { username: 'Test Update', password: 'New Password', avatar: 'Test Avatar' };
    const response = await updateUser(11, update);

    expect(response.affectedRows).toEqual(1);
  });

  it('can getUserById()', async () => {
    const response = await getUserById(11);

    expect(response.id).toEqual(11);
  });

  it('can searchUsersByUsername()', async () => {
    const response = await searchUsersByUsername({q: 'test' });
    expect(response.length).toEqual(11);
  });

  it('can getUserByUsername()', async () => {
    const user = await getUserById(1);
    const response = await getUserByUsername(user.username);
    expect(response.id).toEqual(user.id);
  });

  it('can deleteUser()', async () => {
    const response = await deleteUser(11);

    expect(response.affectedRows).toEqual(1);
  });

  it('can getAllUsersNotInIds()', async () => {
    const ids = await getAllFollowerIds(1);
    if (ids.length) {
      const users = await getUsersNotInIds(ids);
      expect(users.data.length).toBeLessThanOrEqual(users.count);
      if (users.count) {
        const user = users.data[0];
        expect(user.id).toBeTruthy();
        expect(user.username).toBeTruthy();
        expect(user.avatar).toBeTruthy();

      }
    }
  });

  it('can getAllUsersInIds()', async () => {
    const ids = await getAllFollowerIds(1);
    if (ids.length) {
      const users = await getUsersInIds(ids);
      expect(users.data.length).toBeLessThanOrEqual(users.count);
      if (users.count) {
        const user = users.data[0];
        expect(user.id).toBeTruthy();
        expect(user.username).toBeTruthy();
        expect(user.avatar).toBeTruthy();

      }
    }
  });




});


