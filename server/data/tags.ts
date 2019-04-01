import { sql } from '../utils/sql-string';
import { database } from '../db';
import { MysqlResultInfo } from '../db/mysql-facade';


export class Tag {
  id?: number;
  tag_name: string;
  created_at?: string;
}

export const getTagById = (id: number): Promise<Tag> => {
  return database.query(
    sql`SELECT id, tag_name FROM tags WHERE id = ?`, [id]
  )
    .then((response: Tag[]) => Promise.resolve(response[0]));

};

export const createTag = (tag: Tag): Promise<Tag> => {

  return database.query(
    sql`INSERT INTO tags SET ?`, tag
  )
    .then((response: MysqlResultInfo) => getTagById(response.insertId));
};

export const createManyTags = async (tag_names: string[]): Promise<MysqlResultInfo> => {
    return database.query(
      sql`INSERT INTO tags (tag_name) VALUES ?`, [tag_names.map(t => [t])]
    )
    .catch(() => Promise.resolve());
};

export const _getDuplicates = (tag_names: string[]): Promise<any> => {
  return database.query(
    sql`SELECT tag_name FROM tags WHERE tags.tag_name IN (?)`, tag_names
  )
  .then((tags) => Promise.resolve(
    tags.reduce((hash, tag) => { hash[tag.tag_name] = 1; return hash; }, {}))
  );
};

export const deleteTag = (id: number): Promise<MysqlResultInfo> => {
  return database.query(
    sql`DELETE FROM tags WHERE tags.id = ?`, [id]
  );
};

export const getTagsCount = (): Promise<number> => {
  return database.query(
    sql`SELECT COUNT(*) AS tags_count FROM tags`
  )
  .then(([{ tags_count }]) => Promise.resolve(tags_count));

};


export const getTagByTagName = (tag_name: string): Promise<Tag> => {
  return database.query(sql`
    SELECT tags.id, tags.tag_name FROM tags WHERE tags.tag_name = ?
  `, [tag_name]);
};


