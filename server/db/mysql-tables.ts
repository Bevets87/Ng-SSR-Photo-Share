import { sql } from '../utils/sql-string';

const CREATE_USERS = sql`
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username CHAR(255) NOT NULL UNIQUE,
    avatar CHAR(255),
    password CHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

const CREATE_PHOTOS = sql`
CREATE TABLE IF NOT EXISTS photos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url CHAR(255) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

const CREATE_COMMENTS = sql`
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_text TEXT NOT NULL,
    photo_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(photo_id) REFERENCES photos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

const CREATE_LIKES = sql`
CREATE TABLE IF NOT EXISTS likes (
    user_id INT NOT NULL,
    photo_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(photo_id) REFERENCES photos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(user_id, photo_id)
  );
`;

const CREATE_FOLLOWS = sql`
CREATE TABLE IF NOT EXISTS follows (
    follower_id INT NOT NULL,
    followee_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(follower_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(followee_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(follower_id, followee_id)
  );
`;

const CREATE_TAGS = sql`
CREATE TABLE IF NOT EXISTS tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name CHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

const CREATE_PHOTO_TAGS = sql`
CREATE TABLE IF NOT EXISTS photo_tags (
    tag_id INT NOT NULL,
    photo_id INT NOT NULL,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(photo_id) REFERENCES photos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(tag_id, photo_id)
  );
`;

export const creates = () => [
  CREATE_USERS,
  CREATE_PHOTOS,
  CREATE_COMMENTS,
  CREATE_LIKES,
  CREATE_FOLLOWS,
  CREATE_TAGS,
  CREATE_PHOTO_TAGS
];


const DROP_USERS = sql`
DROP TABLE IF EXISTS users;
`;

const DROP_PHOTOS = sql`
DROP TABLE IF EXISTS photos;
`;


const DROP_COMMENTS = sql`
DROP TABLE IF EXISTS comments;
`;


const DROP_LIKES = sql`
DROP TABLE IF EXISTS likes;
`;


const DROP_FOLLOWS = sql`
DROP TABLE IF EXISTS follows;
`;

const DROP_TAGS = sql`
DROP TABLE IF EXISTS tags;
`;


const DROP_PHOTO_TAGS = sql`
DROP TABLE IF EXISTS photo_tags;
`;

export const drops = () => [
  DROP_PHOTO_TAGS,
  DROP_TAGS,
  DROP_FOLLOWS,
  DROP_LIKES,
  DROP_COMMENTS,
  DROP_PHOTOS,
  DROP_USERS
];

