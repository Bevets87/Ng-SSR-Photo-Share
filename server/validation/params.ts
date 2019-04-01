import {
  checkSchema
} from 'express-validator/check';

import {
  applyErrorHandling
} from './error';

export const paramsValidations = applyErrorHandling(checkSchema({
  id: {
    in: ['params'],
    exists: {
      errorMessage: 'id is required'
    },
    isInt: {
      errorMessage: 'id must be an integer'
    }

  }
}));
