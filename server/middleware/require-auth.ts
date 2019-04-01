import { Response, NextFunction, Request } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.authenticated) {
    return res.status(401).json({ message: 'unauthorized' });
  }
  next();
};
