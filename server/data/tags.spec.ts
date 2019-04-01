import { database } from '../db';

import {
  createTag,
  getTagById,
  deleteTag,
  getTagsCount
} from './tags';

describe('Tags Data', () => {

  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 10, tags: 30 });

  });

  afterAll(async () => {
    await database.disconnect();
  });



  it('can createTag()', async () => {
    const response = await createTag({ tag_name: 'test-tag' });
    expect(response).toEqual({
      id: 31,
      tag_name: 'test-tag'
    });
  });



  it('can getTagById()', async () => {
    const response = await getTagById(11);

    expect(response.id).toEqual(11);
  });

  it('can deleteTag()', async () => {
    await deleteTag(11);
    const count = await getTagsCount();
    expect(count).toEqual(30);
  });



});
