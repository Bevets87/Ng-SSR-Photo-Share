import {
  checkSchema
} from 'express-validator/check';

import {
  applyErrorHandling
} from './error';


export const loginValidations = applyErrorHandling(checkSchema({
    username: {
      in: ['body'],
      exists: {
        errorMessage: 'username is required'
      },
      isEmail: {
        errorMessage: 'username must be an email'
      },
      isLength: {
        options: { min: 8, max: 20 },
        errorMessage: 'username must be between 8 and 20 characters long'
        },
    },
    password: {
      in: ['body'],
      exists: {
        errorMessage: 'password is required'
      },
      isLength: {
        options: { min: 8, max: 255 },
        errorMessage: 'password must be atleast 8 characters long'
      }
    },
}));

export const registerValidations = applyErrorHandling(checkSchema({
  username: {
    in: ['body'],
    exists: {
      errorMessage: 'username is required'
    },
    isEmail: {
      errorMessage: 'username must be an email'
    },
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: 'username must be between 8 and 20 characters long'
    },
  },
  password: {
    in: ['body'],
    exists: {
      errorMessage: 'password is required'
    },
    isLength: {
      options: { min: 8, max: 255 },
      errorMessage: 'password must be atleast 8 characters long'
    }
  },

  password_confirmation: {
    in: ['body'],
    exists: {
      errorMessage: 'password confirmation is required'
    },
    isLength: {
      options: { min: 8, max: 255 },
      errorMessage: 'password confirmation must be atleast 8 characters long'
    },
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: 'password confirmation must match password'
    }
  }
}));



