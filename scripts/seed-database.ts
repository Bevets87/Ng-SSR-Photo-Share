import { database } from '../server/db';

const seedDatabase = async () => {
  await database.connect();
  await database.setup();
  await database.seed({ users: 100, tags: 50 });
  await database.disconnect();
  process.exit(0);
};

seedDatabase();
