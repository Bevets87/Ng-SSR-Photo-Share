import {
  checkSchema
} from 'express-validator/check';

import {
  applyErrorHandling
} from './error';




export const postValidations = applyErrorHandling(checkSchema({
  image_url: {
    in: ['body'],
    exists: {
      errorMessage: 'image_url is required'
    },
    isString: {
      errorMessage: 'image_url must be a string'
    }
  },
  tag_names: {
    in: ['body'],
    isArray: {
      errorMessage: 'tag_names must be an array'
    },
    custom: {
      options: (value, { req }) => {

        const isNotOneWord = (s) => s.split(' ').length > 1;
        const isNotString = (s) => typeof s !== 'string';
        const isCharGreaterThan255 = (s) => s.length > 100;
        const invalids = value.filter(s => (isNotString(s) || isCharGreaterThan255(s) || isNotOneWord(s)));
        return value.length <= 10 && !invalids.length;
      },
      errorMessage: 'invalid tag_names format'
    }
  }
}));

export const postCommentValidations = applyErrorHandling(checkSchema({
  comment_text: {
    in: ['body'],
    exists: {
      errorMessage: 'comment_text is required'
    },
    isString: {
      errorMessage: 'comment_text must be a string'
    },
    isLength: {
      options: { max: 2000 },
      errorMessage: 'comment_text cannot exceed 2000 characters'
    }
  }
}));


