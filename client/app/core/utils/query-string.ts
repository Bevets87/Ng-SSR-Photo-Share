import { Pagination } from '../models/pagination.model';

export const paginationString = (p: Pagination): string => {
  return `?limit=${p.limit.toString()}&offset=${p.offset.toString()}`;
};

export const searchString = (term: string): string => {
  return `?q=${term}`;
};
