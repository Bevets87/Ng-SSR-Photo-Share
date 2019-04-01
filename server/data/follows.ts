import { sql } from '../utils/sql-string';
import { database } from '../db';
import { MysqlResultInfo } from '../db/mysql-facade';

export class Follow {
  follower_id: number;
  followee_id: number;
  created_at?: string;

}

export const getAllFollowerIds = (id: number): Promise<number[]> => {
  return database.query(sql`
    SELECT follower_id FROM follows
    WHERE followee_id = ?
  `, [id])
    .then((response) => Promise.resolve(response.map(r => r.follower_id)));
};

export const getAllFolloweeIds = (id: number): Promise<number[]> => {
  return database.query(sql`
    SELECT followee_id FROM follows
    WHERE follower_id = ?
  `, [id])
  .then((response) => Promise.resolve(response.map(r => r.followee_id)));
};


export const createFollow = (follow: Follow): Promise<MysqlResultInfo> => {
  return database.query(
    sql`INSERT INTO follows SET ?`, follow
  );

};

export const createManyFollows = (follows: [number, number][]): Promise<MysqlResultInfo> => {
  return database.query(
    sql`INSERT INTO follows (follower_id, followee_id) VALUES ?`, [follows]
  );
};

export const removeFollow = (follower_id: number, followee_id: number): Promise<MysqlResultInfo> => {
  return database.query(
    sql`DELETE FROM follows WHERE follower_id = ? AND followee_id = ?`, [follower_id, followee_id]
  );
};


export const getUserFollows = (follower_id: number, followee_id: number): Promise<boolean> => {
  return database.query(sql`
    SELECT COUNT(*) AS follows_count FROM follows
    WHERE follower_id = ? AND followee_id = ?`,
    [follower_id, followee_id]
  )
    .then((response) => Promise.resolve(!response[0].follows_count ? false : true));
};

export const getFollowersCount = (followee_id: number): Promise<number> => {
  return database.query(sql`
    SELECT COUNT(*) AS followers_count FROM follows
    WHERE followee_id = ?
  `, [followee_id])
  .then((response) => Promise.resolve(response[0].followers_count));
};

export const getFollowingCount = (follower_id: number): Promise<number> => {
  return database.query(sql`
    SELECT COUNT(*) AS following_count FROM follows
    WHERE follower_id = ?
  `, [follower_id])
  .then((response) => Promise.resolve(response[0].following_count));
};






