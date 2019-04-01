import {
  loginValidations, registerValidations
} from './auth';

import {
  testValidationMiddlewares
} from '../utils/test-utils';

describe('Auth Validation', () => {
  it ('can invalidate loginInfo that does not have a username', async () => {
    const body = {
      password: 'password1234'
    };
    const { res } = await testValidationMiddlewares(loginValidations, { body });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('username is required');
  });

  it('can invalidate loginInfo that does not have a password', async () => {
    const body = {
      username: 'test@test.com'
    };
    const { res } = await testValidationMiddlewares(loginValidations, { body });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('password is required');
  });


  it('can invalidate loginInfo on username has to be longer than 8 characters', async () => {

    const body = {
      username: 't@t.com',
      password: 'password1234'
    };

    const { res } = await testValidationMiddlewares(loginValidations, { body });
    const [ error ] = res.json.mock.calls[0];
    expect(error.message).toContain('username must be between 8 and 20');

  });

  it('can invalidate loginInfo on username is not an email', async () => {
    const body = {
      username: 'test10000',
      password: 'password1234'
    };
    const { res } = await testValidationMiddlewares(loginValidations, { body });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('username must be an email');

  });



  it('can invalidate loginInfo on password must be longer than 8 characters long', async () => {
    const body = {
      username: 'test@test.com',
      password: 'pass123'
    };

    const { res } = await testValidationMiddlewares(loginValidations, { body });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('password must be atleast 8');

  });

  it('can validate loginInfo successfully and next', async () => {
    const body = {
      username: 'test@test.com',
      password: 'password1234'
    };
    const { next, res } = await testValidationMiddlewares(loginValidations, { body });

    expect(res.json).toHaveBeenCalledTimes(0);
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('can invalidate registrationInfo on passwordConfirmation must match password', async () => {
    const body = {
      username: 'test@test.com',
      password: 'password1234',
      password_confirmation: 'password134'
    };
    const { res } = await testValidationMiddlewares(registerValidations, { body });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('password confirmation must match password');
  });


});
