import { Request, Response } from 'express';
import { searchTagsByTagname } from '../data/photo-tags';

export const searchTags = async (req: Request, res: Response) => {
  try {
    const response = await searchTagsByTagname(req.query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ ...error, message: 'unable to search posts by tag names' });
  }
};
