import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB;

const MONGODB_Options = {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: true,
};

const db = async () =>
  mongoose.connect(MONGODB_URL, MONGODB_Options).then((conn) => {
    //mongoose.set('debug', true);
    return conn;
  });

export default db;
