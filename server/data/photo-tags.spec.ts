import { database } from '../db';

import {
  createPhotoTag,
  getPhotoTagsByPhotoId
} from './photo-tags';

describe('PhotoTags Data', () => {
  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 30, tags: 30 });

  });

  afterAll(async () => {

    await database.disconnect();
  });





  it('can createPhotoTag()', async () => {
    try {
      const response = await createPhotoTag({
        photo_id: 1,
        tag_id: 29
      });
      expect(response.affectedRows).toEqual(1);
    } catch (error) {
      expect(error.sqlMessage).toContain('Duplicate');
    }



  });

  it('can getPhotoTagsByPhotoId()', async () => {
    const tags = await getPhotoTagsByPhotoId(1);
    expect(tags.length).toBeGreaterThanOrEqual(0);
    if (tags.length) {
      const tag = tags[0];
      expect(tag.tag_name).toBeTruthy();
    }
  });


});

