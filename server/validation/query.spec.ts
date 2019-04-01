import {
  paginationValidations, searchValidations
} from './query';

import {
  testValidationMiddlewares
} from '../utils/test-utils';



describe('Query Validation', () => {


  it('can validate query with integer limit and integer offset and next()', async () => {
    const query = { limit: 10, offset: 0 };
    const { next } = await testValidationMiddlewares(paginationValidations, { query });
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('can invalidate query with no limit and/or offset', async () => {
    const query = { offset: 0 };
    const { res } = await testValidationMiddlewares(paginationValidations, { query });
    const [ error ] = res.json.mock.calls[0];
    expect(error.message).toContain('limit is required');

  });

  it('can invalidate query with limit and/or offset that is not an integer', async () => {
    const query = { limit: 0, offset: 'zero' };
    const { res } = await testValidationMiddlewares(paginationValidations, { query });
    const [error] = res.json.mock.calls[0];
    expect(error.message).toContain('offset must be an integer');

  });


});
