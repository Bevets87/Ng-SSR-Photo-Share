import { database } from '../db';

import {
  createComment,
  getCommentById,
  deleteComment,
  getCommentsByPhotoId
} from './comments';


describe('Comments Data', () => {
  beforeAll(async () => {
    await database.connect();
    await database.setup();
    await database.seed({ users: 25, tags: 30 });

  });

  afterAll(async () => {

    await database.disconnect();
  });






  it('can createComment()', async () => {

    const response = await createComment({
      comment_text: 'test-comment-text', photo_id: 1, user_id: 18
    });

    expect(response.comment_text).toContain('test-comment-text');
  });

  it('can getCommentById()', async () => {
    const response = await getCommentById(1);
    expect(response.id).toEqual(1);
  });

  it('can deleteComment()', async () => {

    const response = await deleteComment(1);

    expect(response.affectedRows).toEqual(1);
  });

  it('can get commentsByPhotoId()', async () => {
    const response = await getCommentsByPhotoId(1, { limit: 20, offset: 0 });
    expect(response.data.length).toBeGreaterThanOrEqual(0);
    if (response.data.length) {
      expect(response.data[0].username).toBeTruthy();
      expect(response.data[0].comment_text).toBeTruthy();
    }


  });


});

