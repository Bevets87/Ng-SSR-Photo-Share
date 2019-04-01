import {
  Request, Response, NextFunction
} from 'express';
import {
  getUserByUsername,
  createUser
} from '../data/users';
import * as bcrypt from 'bcrypt';

export const getUserFromUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserByUsername(req.body.username);
    req['user'] = user;
    next();
  } catch (error) {
    res.status(400).json({ message: 'invalid username or password'});
  }
};

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    next();
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to hash password' });
  }
};

export const isNewUsername = (req: Request, res: Response, next: NextFunction) => {
  const user = req['user'];
  if (user) {
    res.status(400).json({ message: 'username already exists' });
  } else {
    next();
  }
};



export const isCorrectPassword = async (req: Request, res: Response, next: NextFunction) => {
  const user = req['user'];
  if (user) {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      next();
    } else {
      res.status(400).json({ message: 'invalid username or password' });
    }
  } else {
    res.status(400).json({ message: 'invalid username or password' });
  }
};

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUser({ username: req.body.username, password: req.body.password });
    req['user'] = user;
    next();
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to create user' });
  }
};

export const authenticateRequest = (req: Request, res: Response) => {
  const user = req['user'];
  req.session.user = { id: user.id, username: user.username, avatar: user.avatar };
  req.session.authenticated = true;
  res.status(200).json(req.session.user);
};
export const logoutUser = (req: Request, res: Response) => {
  req.session.destroy(error => {
    if (error) {
      return res.status(400).json({ ...error, message: 'unable to logout user' });
    }
    res.status(200).json({ ok: true });
  });
};

export const getAuth = (req: Request, res: Response) => {

  res.status(200).json({ authenticated: req.session.authenticated, user: req.session.user });
};





