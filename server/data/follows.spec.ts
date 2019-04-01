import { database } from '../db';

import {
  createFollow,
  getAllFolloweeIds,
  getAllFollowerIds,
  getFollowersCount,
  getFollowingCount

} from './follows';


describe('Follows Data', () => {


  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 20, tags: 30 });

  });

  afterAll(async () => {

    await database.disconnect();
  });




  it('can createFollow()', async () => {
    const follow = {
      follower_id: 1,
      followee_id: 18
    };

    try {
      const response = await createFollow(follow);
      expect(response.affectedRows).toEqual(1);
    } catch (error) {
      expect(error.sqlMessage).toContain('Duplicate');
    }

  });

  it('can getAllFolloweeIdsFollowed()', async () => {
    const followees = await getAllFolloweeIds(1);
    expect(followees.length).toBeGreaterThanOrEqual(0);


  });



  it('can getAllFollowerIdsFollowing()', async () => {
    const followers = await getAllFollowerIds(1);
    expect(followers.length).toBeGreaterThanOrEqual(0);
  });

  it ('can getFollowersCount()', async () => {
    const count = await getFollowersCount(1);
    expect(typeof count).toContain('number');
  });

  it('can getFollowingCount()', async () => {
    const count = await getFollowingCount(1);
    expect(typeof count).toContain('number');
  });





});

