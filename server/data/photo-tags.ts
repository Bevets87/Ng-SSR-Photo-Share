import { sql } from '../utils/sql-string';
import { database } from '../db';
import { MysqlResultInfo } from '../db/mysql-facade';
import { SqlQueryRequest, SqlQueryResponse } from '../utils/sql-query';

export class PhotoTag {
  tag_id?: number;
  photo_id?: number;
  tag_name?: string;
}



export const createPhotoTag = (photoTag: PhotoTag): Promise<MysqlResultInfo> => {
  return database.query(
    sql`INSERT INTO photo_tags SET ?`, photoTag
  );
};

export const createManyPhotoTags = (photoTags: [number, number][]): Promise<MysqlResultInfo> => {
  return database.query(
    sql`INSERT INTO photo_tags (tag_id, photo_id) VALUES ?`, [photoTags]
  );

};



export const getPhotoTagsByPhotoId = (id: number): Promise<PhotoTag[]> => {
  return database.query(
    sql`SELECT tags.id, tags.tag_name FROM photo_tags
    INNER JOIN tags ON photo_tags.tag_id = tags.id
    WHERE photo_tags.photo_id = ?`,
  [id]);

};

export const searchTagsByTagname = (q: SqlQueryRequest): Promise<any> => {
  const search = q.q.concat('%');



  const getData = () => database.query(sql`
    SELECT tags.id, tags.tag_name, COUNT(photos.id) AS posts FROM photo_tags
    INNER JOIN tags ON photo_tags.tag_id = tags.id
    INNER JOIN photos ON photo_tags.photo_id = photos.id
    WHERE tags.tag_name LIKE ?
    GROUP BY tags.id
    LIMIT 20 OFFSET 0
  `, [search]);

  return getData();
};

export const getPhotosByTagId = (tag_id: number, q: SqlQueryRequest): Promise<SqlQueryResponse> => {
  const getCount = () => database.query(sql`
    SELECT COUNT(photos.id) AS photos_count FROM photo_tags
    INNER JOIN tags ON photo_tags.tag_id = tags.id
    INNER JOIN photos ON photo_tags.photo_id = photos.id
    WHERE tags.id = ?
  `, [tag_id]);

  const getData = () => database.query(sql`
    SELECT tags.id, tags.tag_name, photos.id AS photo_id, photos.image_url, photos.user_id, photos.created_at FROM photo_tags
    INNER JOIN tags ON photo_tags.tag_id = tags.id
    INNER JOIN photos ON photo_tags.photo_id = photos.id
    WHERE tags.id = ?
    GROUP BY photos.id
    ORDER BY photos.created_at DESC
    LIMIT ? OFFSET ?
  `, [tag_id, q.limit, q.offset]);



  return Promise.all([getData(), getCount()])
  .then(([data, [{ photos_count }]]) => Promise.resolve({ data, count: photos_count }));
};


