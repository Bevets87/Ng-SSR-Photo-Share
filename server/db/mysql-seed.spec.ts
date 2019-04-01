import {
  removeIds,
  createFakeUsers,
  createFakePhotos,
  createFakeFollows,
  createFakeComments,
  createFakeTags,
  createFakePhotoTags,
  createFakeLikes
} from './mysql-seed';
describe('MySql Seed', () => {
  const fakeUsers = createFakeUsers(20);
  const fakePhotos = createFakePhotos(fakeUsers);
  const fakeFollows = createFakeFollows(fakeUsers);
  const fakeLikes = createFakeLikes(fakeUsers, fakePhotos);
  const fakeComments = createFakeComments(fakeUsers, fakePhotos);
  const fakeTags = createFakeTags(25);
  const fakePhotoTags = createFakePhotoTags(fakeTags, fakePhotos);
  const fakeUsersWithNoIds = removeIds(fakeUsers);




  it('can createFakeUsers()', () => {
    const fakeUser = fakeUsers[0];
    expect(fakeUsers.length).toEqual(20);
    expect(fakeUser.length).toEqual(4);
    expect(typeof fakeUser[0]).toEqual('number');
    expect(typeof fakeUser[1]).toEqual('string');
    expect(typeof fakeUser[2]).toEqual('string');
    expect(typeof fakeUser[3]).toEqual('string');

  });

  it('can removeIds()', () => {
    expect(fakeUsers.length).toEqual(fakeUsersWithNoIds.length);
    expect(fakeUsers[0].length).toEqual(4);
    expect(fakeUsersWithNoIds[0].length).toEqual(3);
  });

  it('can createFakePhotos()', () => {
    const fakePhoto = fakePhotos[0];
    expect(fakePhotos.length).toBeGreaterThan(0);
    expect(fakePhoto.length).toEqual(3);
    expect(typeof fakePhoto[0]).toEqual('number');
    expect(typeof fakePhoto[1]).toEqual('string');
    expect(typeof fakePhoto[2]).toEqual('number');


  });

  it('can createFakeComments()', () => {
    const fakeComment = fakeComments[0];
    expect(fakeComments.length).toBeGreaterThan(0);
    expect(typeof fakeComment[0]).toEqual('number');
    expect(typeof fakeComment[1]).toEqual('string');
    expect(typeof fakeComment[2]).toEqual('number');
    expect(typeof fakeComment[3]).toEqual('number');

  });

  it('can createFakeFollows()', () => {
    const fakeFollow = fakeFollows[0];
    expect(fakeFollows.length).toBeGreaterThan(0);
    expect(fakeFollow.length).toEqual(2);
    expect(typeof fakeFollow[0]).toEqual('number');
    expect(typeof fakeFollow[1]).toEqual('number');


  });

  it('can createFakeTags()', () => {
    const fakeTag = fakeTags[0];
    expect(fakeTags.length).toEqual(25);
    expect(typeof fakeTag[0]).toEqual('number');
    expect(typeof fakeTag[1]).toEqual('string');
  });

  it('can createFakePhotoTags()', () => {
    const fakePhotoTag = fakePhotoTags[0];
    expect(fakePhotoTags.length).toBeGreaterThan(0);
    expect(typeof fakePhotoTag[0]).toEqual('number');
    expect(typeof fakePhotoTag[1]).toEqual('number');


  });

  it('can createFakeLikes()', () => {
    const fakeLike = fakeLikes[0];
    expect(fakeLikes.length).toBeGreaterThan(0);
    expect(typeof fakeLike[0]).toEqual('number');
    expect(typeof fakeLike[1]).toEqual('number');

  });

});
