import { Request, Response, NextFunction } from 'express';
export const queryParser = () => (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  if (query.limit) {
    req.query.limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : query.limit;
  }

  if (query.offset) {
    req.query.offset = typeof query.offset === 'string' ? parseInt(query.offset, 10) : query.offset;
  }
  next();
};
