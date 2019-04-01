import * as faker from 'faker';

import {
  userValidations,
  followUserValidations
} from './users';

import {
  testValidationMiddlewares
} from '../utils/test-utils';



describe('User Validation', () => {


  it('can validate user and next()', async () => {
    const body = {
      username: 'test-1@test.com',
      avatar: faker.internet.avatar()
    };
    const { next } = await testValidationMiddlewares(userValidations, { body });
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('can validate user with no avatar and next()', async () => {
    const body = {
      username: 'test-1@test.com',
      avatar: ''
    };
    const { next } = await testValidationMiddlewares(userValidations, { body });
    expect(next).toHaveBeenCalledTimes(3);

  });

  it('can validate create follow and next()', async () => {
    const body = {
      followee_id: 1
    };
    const { next } = await testValidationMiddlewares(followUserValidations, { body });
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('can invalidate create follow', async () => {
    const body = {
      followee_id: 'one'
    };
    const { res } = await testValidationMiddlewares(followUserValidations, { body });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('followee_id must be an integer');

  });


});
