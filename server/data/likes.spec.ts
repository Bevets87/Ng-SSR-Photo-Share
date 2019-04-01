import { database } from '../db';
import {
  createLike,
  getLikesCountByPhotoId,
  getLikesByPhotoId
} from './likes';

describe('Likes Data', () => {


  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 30, tags: 30 });

  });

  afterAll(async () => {

    await database.disconnect();
  });




  it('can createLike()', async () => {
    try {
      const response = await createLike({
        user_id: 10,
        photo_id: 1
      });
      expect(response.affectedRows).toEqual(1);
    } catch (error) {
      expect(error.sqlMessage).toContain('Duplicate');
    }

  });

  it('can getLikesCountByPhotoId()', async () => {
    const likes = await getLikesCountByPhotoId(1);
    expect(likes).toBeGreaterThanOrEqual(1);
  });

  it('can getLikesByPhotoId()', async () => {
    const likes = await getLikesByPhotoId(1);
    if (likes.count) {
      const like = likes.data[0];

      expect(like.id).toBeTruthy();
      expect(like.username).toBeTruthy();
      expect(like.avatar).toBeTruthy();
    }
  });


});

