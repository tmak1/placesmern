import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import HttpError from '../shared/HttpError.js';
import User from '../models/user.js';

// let USERS = [
//   {
//     id: 'u1',
//     name: 'John Doe',
//     email: 'jo.doe@gmail.com',
//     password: 'hello',
//     placeIds: [],
//   },
//   {
//     id: 'u2',
//     name: 'Jane Doe',
//     email: 'ja.doe@gmail.com',
//     password: 'who',
//     places: [],
//   },
// ];
const __dirname = dirname(fileURLToPath(import.meta.url));

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
    if (!users || (users && users.length <= 0)) {
      return next(new HttpError('Could not find any users', 404));
    }
    res.json({ users });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const getUserById = async (req, res, next) => {
  let user;
  try {
    const userId = req.params.uid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new HttpError('Invalid user id', 422));
    }
    user = await User.findById(userId);
    if (!user) {
      return next(new HttpError('Could not find that user', 404));
    }
    res.json({ user });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const signup = async (req, res, next) => {
  let user;
  let token;
  try {
    if (!validationResult(req).isEmpty()) {
      return next(new HttpError('Invalid input', 422));
    }
    const { name, email, password } = req.body;
    if (!req.file || (req.file && !req.file.path)) {
      return next(new HttpError('Did not receive path for image', 400));
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new HttpError('That email is already registered', 400));
    }
    user = new User({
      name,
      email,
      password,
      imageUrl: req.file.path.split('/').slice(-1)[0],
    });
    user = await user.save();
    if (!user) {
      return next(new HttpError('Could not create user', 500));
    }

    token = user.generateAuthenticationToken();
    if (!token) {
      return next(new HttpError('Could not generate token', 500));
    }

    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const login = async (req, res, next) => {
  let user;
  let token;
  try {
    if (!validationResult(req).isEmpty()) {
      return next(new HttpError('Invalid input', 422));
    }
    const { email, password } = req.body;
    user = await User.findByCredentials(email, password, next);
    if (!user) {
      return next(new HttpError('Login failed', 500));
    }
    token = user.generateAuthenticationToken();
    if (!token) {
      return next(new HttpError('Could not generate token', 500));
    }

    res.json({ user, token });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const updateUserById = async (req, res, next) => {
  let user;
  try {
    const userId = req.params.uid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new HttpError('Invalid user id', 422));
    }
    if (!validationResult(req).isEmpty()) {
      return next(new HttpError('Invalid input', 422));
    }
    const { name, email, password } = req.body;
    user = await User.findById(userId);
    if (!user) {
      return next(new HttpError('Could not find that user to update', 404));
    }
    user.name = name;
    user.email = email;
    user.password = password;
    user = await user.save();
    if (!user) {
      return next(new HttpError('Could not update the user', 500));
    }
    res.json({ user });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const deleteUserById = async (req, res, next) => {
  let user;
  try {
    const userId = req.params.uid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new HttpError('Invalid user id', 400));
    }
    user = await User.findById(userId);
    if (!user) {
      return next(new HttpError('Could not find that user to delete', 404));
    }
    user = await user.remove();
    if (!user) {
      return next(new HttpError('Could not delete the user', 500));
    }

    fs.unlink(
      path.resolve(__dirname, '..', '..', 'uploads', user.imageUrl),
      (err) => {
        if (err) {
          console.log(err);
          console.log('User image not deleted', user.imageUrl);
        }
      }
    );
    res.json({ user });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};
export {
  getAllUsers,
  getUserById,
  signup,
  login,
  updateUserById,
  deleteUserById,
};
