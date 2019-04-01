import { sql } from '../utils/sql-string';
import { database } from '../db';
import { MysqlResultInfo } from '../db/mysql-facade';
import { SqlQueryRequest, SqlQueryResponse } from '../utils/sql-query';

export class Photo {
  id?: number;
  image_url: string;
  user_id: number;
  created_at?: string;
}

const columns = `photos.id, photos.image_url, photos.created_at, users.id AS user_id, users.username, users.avatar `;


export const getPhotoById = (id: number): Promise<Photo> => {

  return database.query(sql`
    SELECT ${columns} FROM photos
    INNER JOIN users ON photos.user_id = users.id
    WHERE photos.id = ?
    `
    , [id]
  )
  .then((response: Photo[]) => Promise.resolve(response[0]));
};

export const createManyPhotos = (photos: [string, number][]): Promise<MysqlResultInfo> => {
  return database.query(
    sql`INSERT INTO photos (image_url, user_id) VALUES ?`, [photos]
  );

};

export const createPhoto = (photo: Photo): Promise<Photo> => {
  return database.query(
    sql`INSERT INTO photos SET ?`, photo
  )
  .then((response: MysqlResultInfo) => getPhotoById(response.insertId));

};

export const getPhotosInUserIds = (ids: number[], q: SqlQueryRequest = { limit: 10, offset: 0}): Promise<SqlQueryResponse> => {


  const getCount = () => database.query(sql`
    SELECT COUNT(*) AS photos_count FROM photos
     WHERE photos.user_id IN (?)
  `, [ids]);

  const getData = () => database.query(sql`
    SELECT ${columns} FROM photos
    INNER JOIN users ON photos.user_id = users.id
    WHERE photos.user_id IN (?)
    GROUP BY photos.id
    ORDER BY photos.created_at DESC
    LIMIT ? OFFSET ?
  `, [ids, q.limit, q.offset]);

  return Promise.all([getData(), getCount()])
  .then(([data, [{ photos_count }]]) => Promise.resolve({ data, count: photos_count }));

};


export const getPhotosNotInUserIds = (ids: number[], q: SqlQueryRequest = { limit: 10, offset: 0 }): Promise<SqlQueryResponse> => {

  const getCount = () => database.query(sql`
    SELECT COUNT(*) AS photos_count FROM photos
    WHERE photos.user_id NOT IN (?)
  `, [ids]);

  const getData = () => database.query(sql`
    SELECT ${columns} FROM photos
    INNER JOIN users ON photos.user_id = users.id
    WHERE photos.user_id NOT IN (?)
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `, [ids, q.limit, q.offset]);

  return Promise.all([getData(), getCount()])
  .then(([data, [{ photos_count }]]) => Promise.resolve({ data, count: photos_count }));
};

export const getPhotosByUserId = (id: number, q: SqlQueryRequest = { limit: 10, offset: 0 }): Promise<SqlQueryResponse> => {

  const getCount = () => database.query(sql`
    SELECT COUNT(*) AS photos_count FROM photos
    WHERE photos.user_id = ?
  `, [id]);

  const getData = () => database.query(sql`
    SELECT ${columns} FROM photos
    INNER JOIN users ON photos.user_id = users.id
    WHERE photos.user_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `, [id, q.limit, q.offset]);

  return Promise.all([getData(), getCount()])
    .then(([data, [{ photos_count }]]) => Promise.resolve({ data, count: photos_count }));
};

export const deletePhoto = (id: number, user_id: number): Promise<MysqlResultInfo> => {
  return database.query(sql`
    DELETE FROM photos WHERE photos.id = ? AND photos.user_id = ?
  `, [id, user_id]);
};

