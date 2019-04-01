import * as faker from 'faker';

import {
  postValidations,
  postCommentValidations
} from './posts';

import {
  testValidationMiddlewares
} from '../utils/test-utils';


describe('Post Validation', () => {

  it('can validate post and next()', async () => {
    const body = {
      image_url: faker.image.image(),
      tag_names: []
    };
    const { next } = await testValidationMiddlewares(postValidations, { body });
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('can invalidate post on image is not a string', async () => {
    const body = {
      image_url: 3982938295,
      tag_names: []
    };
    const { res } = await testValidationMiddlewares(postValidations, { body });
    const [ error ] = res.json.mock.calls[0];
    expect(error.message).toContain('image_url must be a string');

  });

  it('can invalidate post on image is required', async () => {
    const body = {
      test: true,
      tag_names: []
    };
    const { res } = await testValidationMiddlewares(postValidations, { body });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('image_url is required');
  });

  it('can validate comment post and next()', async () => {
    const tag_names = [];
    for (let i = 0; i < 10; i++) {
      tag_names.push(faker.lorem.words(1));
    }
    const body = {
      comment_text: faker.lorem.paragraph()
    };
    const { next } = await testValidationMiddlewares(postCommentValidations, { body });
    expect(next).toHaveBeenCalledTimes(2);
  });



  it('can invalidate comment post on comment text exceeds 2000 characters', async () => {
    const body = {
      comment_text: faker.lorem.words(2000),
    };
    const { res } = await testValidationMiddlewares(postCommentValidations, { body });
    const [ error ] = res.json.mock.calls[0];
    expect(error.message).toContain('comment_text cannot exceed 2000 characters');
  });

  it('can invalidate post on tag names that have an invalid format', async () => {
    const tag_names = [];
    for (let i = 0; i < 10; i++) {
      tag_names.push(faker.lorem.words(2));
    }
    const body = {
      image_url: faker.image.image(),
      tag_names
    };
    const { res } = await testValidationMiddlewares(postValidations, { body });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('invalid tag_names format');
  });




});
