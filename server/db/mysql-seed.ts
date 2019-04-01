import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import { createManyUsers } from '../data/users';
import { createManyPhotos } from '../data/photos';
import { createManyComments } from '../data/comments';
import { createManyLikes } from '../data/likes';
import { createManyFollows } from '../data/follows';
import { createManyTags } from '../data/tags';
import { createManyPhotoTags } from '../data/photo-tags';

const createPicsumImage = (id) => `https://picsum.photos/350/225?image=${id}`;
const spliceRandomly = (array: any[]): any[][] => {
  const random_index = Math.floor(Math.random() * array.length);
  const removed = array.splice(random_index, 1);


  return removed;
};

const getRandomEntryFrom = (array: number[]): number => {
  const length = array.length;
  const random_index = Math.floor(Math.random() * length);
  return array[random_index];
};



export const createFakeUser = (id: number): [number, string, string, string] => {
    return [
      id,
      `test-${id}@test.com`,
      `password-${id}`,
      faker.internet.avatar()
    ];


};

export const createFakePhoto = (id: number, user_id: number): [number, string, number] => {
  return [
    id,
    createPicsumImage(id),
    user_id
  ];
};

export const createFakeComment = (id: number, photo_id: number, user_id: number): [number, string, number, number] => {
  return [
    id,
    faker.lorem.text(),
    photo_id,
    user_id
  ];
};

export const createFakeTag = (id: number): [number, string] => {
  return [
    id,
    `${faker.lorem.word()}-${id}`
  ];
};

export const createFakeUsers = (amount: number): [number, string, string, string][] => {
  const users = [];
  let count = 1;


  while (count <= amount) {
    users.push(createFakeUser(count));
    count++;
  }


  return users;
};

export const createFakePhotos = (users: [number, string, string, string ][]): [number, string, number][] => {
  const photos = [];
  let photo_count = 1;
  users.forEach(user => {
    const user_id = user[0];
    let count = getRandomEntryFrom([0, 2, 5]);
    while (count > 0) {
      photos.push(createFakePhoto(photo_count++, user_id));
      count--;
    }
  });
  return photos;

};

export const createFakeComments = (
  users: [number, string, string, string][],
  photos: [number, string, number][])
  : [number, string, number, number][] => {
  const comments = [];
  let comment_count = 1;
  photos.forEach(photo => {
    const photographer_id = photo[2];
    const commenters = users.filter(u => u[0] !== photographer_id);
    const photo_id = photo[0];
    let count = getRandomEntryFrom([0, 2, 5, 7]);
    while (count > 0) {
      const user = spliceRandomly(commenters);
      const user_id: number = user[0][0];
      comments.push(createFakeComment(comment_count++, photo_id, user_id));
      count--;
    }

  });

  return comments;
};

export const createFakeFollows = (users: [number, string, string, string ][]): [number, number][] => {
  const follows = [];
  users.forEach(user => {
    const followee_id = user[0];
    const followers = users.filter(u => u[0] !== followee_id);

    let count = getRandomEntryFrom([0, 2, 5]);
    while (count > 0) {
      const follower = spliceRandomly(followers);
      const follower_id = follower[0][0];
      follows.push([follower_id, followee_id]);
      count--;
    }
  });

  return follows;
};


export const createFakeLikes = (
  users: [number, string, string, string][],
  photos: [number, string, number][]
): [number, number][] => {
  const likes = [];

  photos.forEach(photo => {
    const photographer_id = photo[2];
    const likers = users.filter(u => u[0] !== photographer_id);
    const photo_id = photo[0];
    let count = getRandomEntryFrom([0, 2, 5]);
    while (count > 0) {
      const user = spliceRandomly(likers);
      const user_id: number = user[0][0];
      likes.push([user_id, photo_id]);
      count--;
    }
  });

  return likes;

};

export const createFakeTags = (amount: number): [number, string][] => {
  const tags = [];
  let count = 1;
  while (count <= amount) {
    tags.push(createFakeTag(count++));
  }
  return tags;
};

export const createFakePhotoTags = (
  tags: [number, string][],
  photos: [number, string, number][]
): [number, number][] => {
  const photo_tags = [];

  photos.forEach(photo => {
    const photo_id = photo[0];
    const copy_of_tags = tags.slice();
    let count = getRandomEntryFrom([0, 2, 5]);

    while (count > 0) {
      const tag = spliceRandomly(copy_of_tags);
      const tag_id: number = tag[0][0];
      photo_tags.push([tag_id, photo_id]);
      count--;
    }
  });

  return photo_tags;
};

export const removeIds = (collection) => {
  const filtered = collection.map(resource => {
    const copy = resource.slice();
    copy.splice(0, 1);
    return copy;
  });


  return filtered;
};

const hashPasswords = users => {
  return users.map(user => {
    const copy = user.slice();
    const hash = bcrypt.hashSync(copy[2], 10);
    copy.splice(2, 1, hash);
    return copy;
  });
};

export interface SeedOptions {
  users: number;
  tags: number;
}


export const createSeed = async ({ users = 20, tags = 20 }: SeedOptions) => {
  users = users < 10 ? 10 : users;
  tags = tags < 10 ? 10 : tags;
  const fakeUsers = createFakeUsers(users);
  const fakePhotos = createFakePhotos(fakeUsers);
  const fakeComments = createFakeComments(fakeUsers, fakePhotos);
  const fakeFollows = createFakeFollows(fakeUsers);
  const fakeLikes = createFakeLikes(fakeUsers, fakePhotos);
  const fakeTags = createFakeTags(tags);
  const fakePhotoTags = createFakePhotoTags(fakeTags, fakePhotos);


  const seed = {
    users: removeIds(hashPasswords(fakeUsers)),
    photos: removeIds(fakePhotos),
    follows: fakeFollows,
    comments: removeIds(fakeComments),
    tags: removeIds(fakeTags),
    likes: fakeLikes,
    photo_tags: fakePhotoTags
  };


  await createManyUsers(seed.users);
  await createManyPhotos(seed.photos);
  await createManyComments(seed.comments);
  await createManyLikes(seed.likes);
  await createManyFollows(seed.follows);
  await createManyTags(seed.tags);
  await createManyPhotoTags(seed.photo_tags);

};


