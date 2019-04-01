import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator/check';

export const handleValidationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array().shift()['msg'] });
  } else {
    next();
  }
};

export const applyErrorHandling = (validationChains: ValidationChain[]) => {
  return [
    ...validationChains,
    handleValidationError
  ];
};

