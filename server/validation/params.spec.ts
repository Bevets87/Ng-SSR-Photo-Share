import {
  paramsValidations
} from './params';

import {
  testValidationMiddlewares
} from '../utils/test-utils';



describe('Params Validation', () => {


  it('can validate params with integer id and next()', async () => {
    const params = { id: 1 };
    const { next } = await testValidationMiddlewares(paramsValidations, { params });
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('can invalidate params with no id', async () => {
    const params = { };
    const { res } = await testValidationMiddlewares(paramsValidations, { params });
    const [ error ] = res.json.mock.calls[0];
    expect(error.message).toContain('id is required');

  });

  it('can invalidate params with id that is not an int', async () => {
    const params = { id: 'one' };
    const { res } = await testValidationMiddlewares(paramsValidations, { params });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('id must be an integer');

  });


});
