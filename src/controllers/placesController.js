import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import Place from '../models/place.js';
import User from '../models/user.js';
import HttpError from '../shared/HttpError.js';
import getGeoCoords from '../shared/location.js';

// {
//   "title": "Louvre Museum",
//   "description": "From Roman sculptures to da Vinci's 'Mona Lisa'",
//   "coordinates": {
//     "lat": 48.859210,
//     "lng": 2.337295
//   },
//   "address": "20 W 34th St, New York, NY 10001",
//   "creatorId": "u2"
// }

// let DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'Empire State Building',
//     description: 'One of the most famous skyscrapers',
//     coordinates: {
//       lat: 40.7484474,
//       lng: -73.9871516,
//     },
//     address: '20 W 34th St, New York, NY 10001',
//     creatorId: 'u1',
//   },
//   {
//     id: 'p2',
//     title: 'Eiffel Tower',
//     description: "Gustave Eiffel's iconic, wrought-iron 1889 tower.",
//     coordinates: {
//       lat: 48.858441,
//       lng: 2.293235,
//     },
//     address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
//     creatorId: 'u1',
//   },
// ];
const __dirname = dirname(fileURLToPath(import.meta.url));

const getAllPlaces = async (req, res, next) => {
  let places;
  try {
    places = await Place.find({});
    if (!places || (places && places.length <= 0)) {
      return next(new HttpError('Could not find any places', 404));
    }
    res.json({ places });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const getPlaceById = async (req, res, next) => {
  let place;
  try {
    const placeId = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return next(new HttpError('Invalid place id', 400));
    }
    place = await Place.findById(placeId);
    if (!place) {
      return next(new HttpError('Could not find that place', 404));
    }
    res.json({ place });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const getPlacesByUserId = async (req, res, next) => {
  let user;
  let places;
  try {
    const userId = req.params.uid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new HttpError('Invalid user id', 422));
    }
    user = await User.findById(userId);
    if (!user) {
      return next(new HttpError('Could not find that user', 404));
    }
    places = await Place.find({ creatorId: user.id });
    if (!places) {
      return next(
        new HttpError('Could not find any places for that user', 404)
      );
    }
    res.json({ places });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const createPlace = async (req, res, next) => {
  let place;
  try {
    if (!validationResult(req).isEmpty()) {
      return next(new HttpError('Invalid inputs', 422));
    }
    const { title, description, address } = req.body;
    if (!req.file || (req.file && !req.file.path)) {
      return next(new HttpError('Did not receive path for image', 400));
    }
    const creatorId = req.userData.userId;
    const user = await User.findById(creatorId);
    if (!user) {
      return next(
        new HttpError('That user to create that place does not exist', 400)
      );
    }
    const placeExists = await Place.findOne({ title });

    if (placeExists) {
      return next(new HttpError('That place aleady exists for that user', 400));
    }
    place = new Place({
      title,
      description,
      address,
      imageUrl: req.file.path.split('/').slice(-1)[0],
      coordinates: {
        lat: 40.7484474,
        lng: -73.9871516,
      },
      creatorId,
    });
    place = await place.save();
    if (!place) {
      return next(new HttpError('Could not create place', 500));
    }

    res.json({ place });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const updatePlaceById = async (req, res, next) => {
  let place;
  try {
    if (!validationResult(req).isEmpty()) {
      return next(new HttpError('Invalid inputs', 422));
    }
    const { title, description } = req.body;
    const creatorId = req.userData.userId;
    const placeId = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return next(new HttpError('Invalid place id', 422));
    }
    place = await Place.findById(placeId);
    if (!place) {
      return next(
        new HttpError('That place does not exist for that user', 404)
      );
    }

    if (place.creatorId.toString() !== creatorId) {
      return next(new HttpError('Unauthorized operation', 422));
    }
    fs.unlink(
      path.resolve(__dirname, '..', '..', 'uploads', place.imageUrl),
      (err) => {
        if (err) {
          console.log(err);
          console.log('Place image not deleted', place.imageUrl);
        }
      }
    );

    place.title = title;
    place.description = description;
    delete place.imageUrl;
    (place.imageUrl = req.file.path.split('/').slice(-1)[0]),
      (place = await place.save());
    if (!place) {
      return next(new HttpError('Could not update that place', 500));
    }
    res.json({ place });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const deletePlaceById = async (req, res, next) => {
  let place;
  try {
    const placeId = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return next(new HttpError('Invalid place id', 422));
    }
    const creatorId = req.userData.userId;
    place = await Place.findById(placeId).populate('creatorId');
    if (!place) {
      return next(
        new HttpError('Could not find the place to delete for that user', 500)
      );
    }
    if (place.creatorId._id.toString() !== creatorId) {
      return next(new HttpError('Unauthorized operation', 422));
    }
    place = await place.remove();
    fs.unlink(
      path.resolve(__dirname, '..', '..', 'uploads', place.imageUrl),
      (err) => {
        if (err) {
          console.log(err);
          console.log('Place image deletion failed ', place.imageUrl);
        }
      }
    );
    res.json({ place });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

export {
  getAllPlaces,
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
