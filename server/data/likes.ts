import { sql } from '../utils/sql-string';
import { database } from '../db';
import { MysqlResultInfo } from '../db/mysql-facade';
import { SqlQueryRequest, SqlQueryResponse } from 'server/utils/sql-query';

export class Like {
  user_id: number;
  photo_id: number;
  created_at?: string;
}

export const getLikesByPhotoId = (id: number, q: SqlQueryRequest = { limit: 20, offset: 0 }): Promise<SqlQueryResponse> => {
  const columns = `users.id, users.username, users.avatar `;
  const getCount = () => database.query(sql`
    SELECT COUNT(*) AS likes_count FROM likes
    WHERE likes.photo_id = ?
  `, [id]);
  const getData = () => database.query(sql`
    SELECT ${columns} FROM likes
    INNER JOIN users ON likes.user_id = users.id
    WHERE likes.photo_id = ?
    ORDER BY likes.created_at
    LIMIT ? OFFSET ?
  `, [id, q.limit, q.offset]);

  return Promise.all([getData(), getCount()])
  .then(([ data, [{ likes_count }]]) => Promise.resolve({ data, count: likes_count }));
};

export const createLike = (like: Like): Promise<MysqlResultInfo> => {
  return database.query(
    sql`INSERT INTO likes SET ?`, like
  );

};

export const createManyLikes = (likes: [number, number][]): Promise<MysqlResultInfo> => {
  return database.query(
    sql`INSERT INTO likes (user_id, photo_id) VALUES ?`, [likes]
  );
};


export const getLikesCount = (): Promise<number> => {
  return database.query(
    sql`SELECT COUNT(*) AS likes_count FROM likes`
  )
  .then(response => Promise.resolve(response[0].likes_count));

};

export const getLikesCountByPhotoId = (id: number): Promise<number> => {
  return database.query(
    sql`SELECT COUNT(*) AS likes_count FROM likes WHERE likes.photo_id = ?`, [id]
  )
  .then((response) => Promise.resolve(response[0].likes_count));
};

export const getUserLikes = (user_id: number, photo_id: number): Promise<boolean> => {
  return database.query(
    sql`SELECT COUNT(*) AS likes_count FROM likes WHERE user_id = ? AND photo_id = ?`,
    [user_id, photo_id]
  )
  .then((response) => Promise.resolve(!response[0].likes_count ? false : true));
};

export const removeLike = (user_id: number, photo_id: number): Promise<MysqlResultInfo> => {
  return database.query(
    sql`DELETE FROM likes WHERE user_id = ? AND photo_id = ?`, [user_id, photo_id]
  );
};

export const getLikesByUserId = (id: number, q: SqlQueryRequest): Promise<SqlQueryResponse> => {
  const columns = `users.id, users.username, users.avatar, likes.photo_id`;
  const getCount = () => database.query(sql`
    SELECT COUNT(*) AS likes_count FROM likes
    WHERE likes.photo_id = ?
  `, [id]);
  const getData = () => database.query(sql`
    SELECT ${columns} FROM likes
    INNER JOIN users ON likes.user_id = users.id
    WHERE likes.user_id = ?
    ORDER BY likes.created_at
    LIMIT ? OFFSET ?
  `, [id, q.limit, q.offset]);

  return Promise.all([getData(), getCount()])
    .then(([data, [{ likes_count }]]) => Promise.resolve({ data, count: likes_count }));
};



