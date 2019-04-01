import { database } from '../db';
import {
  getPhotosNotInUserIds,
  getPhotosByUserId,
  getPhotosInUserIds,
  getPhotoById,
  createPhoto
} from './photos';
import {
  getAllFolloweeIds
} from './follows';
import {
  getUserById
} from './users';


describe('Photos Data', () => {


  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 30, tags: 50 });
  });

  afterAll(async () => {

    await database.disconnect();
  });



  it('can getPhotoById()', async () => {
    const response = await getPhotoById(1);
    expect(response.id).toEqual(1);
  });

  it('can createPhoto()', async () => {
    const response = await createPhoto({ image_url: 'test-image-url', user_id: 1 });
    expect(response.image_url).toContain('test-image-url');
  });

  it('can getPhotosInIds()', async () => {
    const ids = await getAllFolloweeIds(1);
    if (ids.length) {
      const photos = await getPhotosInUserIds(ids, {
        limit: 10, offset: 0
      });
      expect(photos.count).toBeGreaterThanOrEqual(0);
    } else {
      expect(ids.length).toEqual(0);
    }

  });

  it('can getAllPhotosNotByUserId()', async () => {
    const user = await getUserById(1);
    const photos = await getPhotosNotInUserIds([1], { limit: 10, offset: 0 });
    if (photos.count) {

      const randomIndex = Math.floor(Math.random() * photos.data.length);
      const photo = photos.data[randomIndex];

      expect(photo.username === user.username).toBeFalsy();
    }
  });

  it('can getAllPhotosByUserId()', async () => {
    const user = await getUserById(1);
    const photos = await getPhotosByUserId(1, { limit: 10, offset: 0 });
    if (photos.count) {

      const randomIndex = Math.floor(Math.random() * photos.data.length);
      const photo = photos.data[randomIndex];
      expect(photo.username === user.username).toBeTruthy();
    }

  });


});

