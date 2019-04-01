import { sql } from '../utils/sql-string';
import { database } from '../db';
import { MysqlResultInfo } from '../db/mysql-facade';
import { SqlQueryResponse, SqlQueryRequest } from '../utils/sql-query';


export class User {
  id?: number;
  username: string;
  password?: string;
  avatar?: string;
  created_at?: string;
}
export const getUserById = (id: number): Promise<User> => {
  return database.query(
    sql`SELECT id, username, password, avatar FROM users WHERE id = ?`, [id]
  )
  .then((response: User[]) => Promise.resolve(response[0]));

};

export const createUser = (user: User): Promise<User> => {
  return database.query(
    sql`INSERT INTO users SET ?`, user
  )
  .then((response: MysqlResultInfo) => getUserById(response.insertId));
};

export const createManyUsers = (users: [string, string, string][]): Promise<MysqlResultInfo> => {
  return database.query(
    sql`INSERT INTO users (username, password, avatar) VALUES ?`, [users]
  );

};

export const deleteUser = (id: number): Promise<MysqlResultInfo> => {
  return database.query(
    sql`DELETE FROM users WHERE users.id = ?`, [id]
  );
};



export const updateUser = (id: number, user: User): Promise<MysqlResultInfo> => {
  return database.query(
    sql`UPDATE users SET username = ?, avatar = ? WHERE id = ?`,
    [user.username, user.avatar, id]
  );

};

export const changeUserPassword = (id: number, password: string): Promise<MysqlResultInfo> => {
  return database.query(
    sql`UPDATE users SET password = ? WHERE id = ?`, [password, id]
  );
};

export const getUserByUsername = (username: string): Promise<User> => {
  return database.query(
    sql`SELECT id, username, password, avatar FROM users WHERE username = ?`, [username]
  )
  .then((response: User[]) => Promise.resolve(response[0]));
};



export const getUsersNotInIds = (ids: number[], q: SqlQueryRequest = { limit: 20, offset: 0 }): Promise<SqlQueryResponse> => {
  const columns = `users.id, users.username, users.avatar `;
  const getCount = () => database.query(sql`
    SELECT COUNT(*) AS users_count FROM users WHERE users.id NOT IN (?)
  `, [ids]);

  const getData = () => database.query(sql`
    SELECT ${columns} FROM users
    WHERE users.id NOT IN (?)
    LIMIT ? OFFSET ?
  `, [ids, q.limit, q.offset]);

  return Promise.all([getData(), getCount()])
  .then(([ data, [{ users_count }]]) => Promise.resolve({ data, count: users_count }));
};

export const getUsersInIds = (ids: number[], q: SqlQueryRequest = { limit: 20, offset: 0}): Promise<SqlQueryResponse> => {
  const columns = `users.id, users.username, users.avatar `;
  const getCount = () => database.query(sql`
    SELECT COUNT(*) AS users_count FROM users WHERE users.id IN (?)
  `, [ids]);

  const getData = () => database.query(sql`
    SELECT ${columns} FROM users
    WHERE users.id IN (?)
    LIMIT ? OFFSET ?
  `, [ids, q.limit, q.offset]);

  return Promise.all([getData(), getCount()])
    .then(([data, [{ users_count }]]) => Promise.resolve({ data, count: users_count }));
};

export const searchUsersByUsername = (q: SqlQueryRequest): Promise<User[]> => {
  const search = q.q.concat('%');

  const columns = `users.id, users.username, users.avatar `;
  const getData = () => database.query(sql`
    SELECT ${columns} FROM users
    WHERE LOWER(username) LIKE ?
    LIMIT 20 OFFSET 0
  `, [search]);

  return getData();
};


