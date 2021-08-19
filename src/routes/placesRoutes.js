import express from 'express';
import { check } from 'express-validator';
import checkAuth from '../middleware/checkAuth.js';

import { fileUploadPlaces } from '../middleware/fileUpload.js';

const router = express.Router();

router
  .get('/', getAllPlaces)
  .get('/users/:uid', getPlacesByUserId)
  .get('/:pid', getPlaceById)
  .use(checkAuth)
  .post(
    '/',
    fileUploadPlaces.single('image'),
    [
      check('title').not().isEmpty(),
      check('description').not().isEmpty(),
      check('address').not().isEmpty(),
    ],
    createPlace
  )
  .patch(
    '/:pid',
    fileUploadPlaces.single('image'),
    [check('title').not().isEmpty(), check('description').not().isEmpty()],
    updatePlaceById
  )
  .delete('/:pid', deletePlaceById);

import {
  getAllPlaces,
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
} from '../controllers/placesController.js';

export default router;
