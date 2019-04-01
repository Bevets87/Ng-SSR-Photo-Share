import {
  checkSchema
} from 'express-validator/check';

import {
  applyErrorHandling
} from './error';


export const userValidations = applyErrorHandling(checkSchema({
  username: {
    in: ['body'],
    exists: {
      errorMessage: 'username is required'
    },
    isEmail: {
      errorMessage: 'username must be an email'
    },
    isLength: {
      errorMessage: 'username must be between 8 and 20 characters long',
      options: { min: 8, max: 20 }
    }
  },
  avatar: {
    in: ['body'],
    isString: {
      options: { max: 255 },
      errorMessage: 'avatar must be a valid string'
    }
  }
}));

export const followUserValidations = applyErrorHandling(checkSchema({
  followee_id: {
    in: ['body'],
    exists: {
      errorMessage: 'followee_id is required'
    },
    isInt: {
      errorMessage: 'followee_id must be an integer'
    }
  }
}));

export const changePasswordValidations = applyErrorHandling(checkSchema({
  old_password: {
    in: ['body'],
    exists: {
      errorMessage: 'old_password is required'
    },
    isLength: {
      options: { min: 8, max: 255 },
      errorMessage: 'old_password must be atleast 8 characters long'
    }
  },
  new_password: {
    in: ['body'],
    exists: {
      errorMessage: 'new_password is required'
    },
    isLength: {
      options: { min: 8, max: 255 },
      errorMessage: 'new_password must be atleast 8 characters long'
    }
  }
}));


