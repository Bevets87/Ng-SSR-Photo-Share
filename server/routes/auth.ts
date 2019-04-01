import * as express from 'express';
import {
  isNewUsername,
  hashPassword,
  createNewUser,
  authenticateRequest,
  getUserFromUsername,
  isCorrectPassword,
  logoutUser,
  getAuth
} from '../controllers/auth';

import {
  loginValidations, registerValidations
} from '../validation/auth';

const router = express.Router();

router.route('/register')
.post([
  ...registerValidations,
  getUserFromUsername,
  isNewUsername,
  hashPassword,
  createNewUser,
  authenticateRequest
]);

router.route('/login')
.post([
  ...loginValidations,
  getUserFromUsername,
  isCorrectPassword,
  authenticateRequest
]);

router.route('/logout')
.post(
  logoutUser
);

router.route('/me')
.get(getAuth);



export const authRouter = router;
