import mongoose from 'mongoose';

export const printCounts = (users, places) => {
  return JSON.stringify(
    {
      count: {
        users,
        places,
      },
    },
    null,
    2
  );
};

export const randomObjectId = () => {
  return mongoose.Types.ObjectId();
};
