import {
  checkSchema
} from 'express-validator/check';

import {
  applyErrorHandling
} from './error';

export const paginationValidations = applyErrorHandling(checkSchema({
  limit: {
    in: ['query'],
    exists: {
      errorMessage: 'limit is required'
    },
    isInt: {
      errorMessage: 'limit must be an integer'
    }

  },
  offset: {
    in: ['query'],
    exists: {
      errorMessage: 'offset is required'
    },
    isInt: {
      errorMessage: 'offset must be an integer'
    }
  }
}));


export const searchValidations = applyErrorHandling(checkSchema({
  q: {
    in: ['query'],
    exists: {
      errorMessage: 'search is required'
    },
    isString: {
      errorMessage: 'search must be a string'
    }
  }
}));

