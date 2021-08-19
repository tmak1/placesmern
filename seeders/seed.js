import db from '../src/shared/db/mongo.js';
import users from './users.js';
import places from './places.js';

import User from '../src/models/user.js';
import Place from '../src/models/place.js';

import { printCounts } from './seedHelpers.js';

const clearDb = async (deleteOperation = false) => {
  try {
    const { deletedCount: users } = await User.deleteMany({});
    const { deletedCount: places } = await Place.deleteMany({});

    const deleted = printCounts(users, places);
    console.log(`Data destroyed!\n${deleted}`);
    if (deleteOperation) {
      process.exit(0);
    }
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await clearDb();

    // ----- USERS -------
    const createdUsers = await User.insertMany(users);

    // ----- PLACES -------
    const samplePlaces = [
      {
        ...places[0],
        creatorId: createdUsers[0]._id,
      },
      {
        ...places[1],
        creatorId: createdUsers[0]._id,
      },
      {
        ...places[2],
        creatorId: createdUsers[1]._id,
      },
    ];
    const createdPlaces = await Place.insertMany(samplePlaces);

    // ----------------------- X ------------------------------

    const inserted = printCounts(createdUsers.length, createdPlaces.length);
    console.log(`Data imported!${inserted}`);
    process.exit(0);
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

try {
  await db();
  if (process.argv[0] === '-d') {
    console.log('Deleting..');
    await clearDb(true);
  } else {
    console.log('Deleting/Inserting..');
    await importData();
  }
} catch (error) {
  console.log(error);
}
