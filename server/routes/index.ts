import { authRouter } from './auth';
import { apiRouter } from './api';
import { requireAuth } from '../middleware/require-auth';

export const routes = (app) => {
  app.use('/auth', authRouter);
  app.use('/api', requireAuth, apiRouter);
};
