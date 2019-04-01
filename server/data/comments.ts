import { sql } from '../utils/sql-string';
import { database } from '../db';
import { MysqlResultInfo } from '../db/mysql-facade';
import { SqlQueryRequest, SqlQueryResponse } from '../utils/sql-query';

export class Comment {
  id?: number;
  comment_text?: string;
  photo_id?: number;
  user_id?: number;
  created_at?: string;
  username?: string;
}

export const getCommentById = (id: number): Promise<Comment> => {
  const columns = `comments.id, comments.comment_text, users.username `;
  return database.query(sql`
    SELECT ${columns} FROM comments
    INNER JOIN users ON comments.user_id = users.id
    WHERE comments.id = ?
  `, [id]
  )
  .then((response: Comment[]) => Promise.resolve(response[0]));
};


export const getCommentsByPhotoId = (id: number, q: SqlQueryRequest = { limit: 5, offset: 0 }): Promise<SqlQueryResponse> => {
  const columns = `comments.id, comments.comment_text, users.username `;
  const getCount = () => database.query(sql`
    SELECT COUNT(*) AS comments_count FROM comments
    WHERE comments.photo_id = ?
  `, [id]);

  const getData = () => database.query(sql`
    SELECT ${columns} FROM comments
    INNER JOIN users ON comments.user_id = users.id
    WHERE comments.photo_id = ?
    ORDER BY comments.created_at DESC
    LIMIT ? OFFSET ?
  `, [id, q.limit, q.offset]);

  return Promise.all([getData(), getCount()])
  .then(([data, [{ comments_count }]]) => Promise.resolve({ data, count: comments_count }));
};

export const createComment = (comment: Comment): Promise<Comment> => {
  return database.query(
    sql`INSERT INTO comments SET ?`, comment
  )
  .then((response: MysqlResultInfo) => getCommentById(response.insertId));

};

export const createManyComments = (comments: [string, number, number][]): Promise<MysqlResultInfo> => {
  return database.query(
    sql`INSERT INTO comments (comment_text, photo_id, user_id) VALUES ?`, [comments]
  );
};

export const deleteComment = (id: number): Promise<MysqlResultInfo> => {
  return database.query(
    sql`DELETE FROM comments WHERE comments.id = ?`, [id]
  );
};

export const getCommentsCount = (): Promise<number> => {
  return database.query(
    sql`SELECT COUNT(*) AS comments_count FROM comments`
  )
  .then((response) => Promise.resolve(response[0].comments_count));
};

export const getCommentsCountByPhotoId = (id: number): Promise<number> => {
  return database.query(
    sql`SELECT COUNT(*) AS comments_count FROM comments WHERE comments.photo_id = ?`, [id]
  )
  .then((response) => Promise.resolve(response[0].comments_count));
};






