import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

import db from './src/shared/db/mongo.js';
import usersRoutes from './src/routes/usersRoutes.js';
import placesRoutes from './src/routes/placesRoutes.js';
import HttpError from './src/shared/HttpError.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use('/api/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.use('/api/users', usersRoutes);
app.use('/api/places', placesRoutes);

app.use('/api/googleApiKey', (req, res, next) => {
  res.json({ apiKey: process.env.API_KEY });
});

app.use((error, req, res, next) => {
  console.log(error.message);
  console.log(error.code);

  if (req.file) {
    fs.unlink(path.resolve(__dirname, req.file.path), (err) => {
      if (err) {
        console.log(err);
        console.log('Image not deleted', req.file.path);
      }
    });
  }
  if (!res.headersSent) {
    res.status(error.code).json({ error });
  }
  next(error);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'client', 'build')));
}
app.use('/*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

db()
  .then((conn) => {
    app.listen(PORT, () => {
      console.log('MongoDb connected: ');
      console.log(`Listening: http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDb failed: ', err);
  });
