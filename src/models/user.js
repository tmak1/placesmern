import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

import HttpError from '../shared/HttpError.js';
import Place from './place.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: { type: String, trim: true, required: true },
    imageUrl: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 12);
      return next();
    } catch (error) {
      throw error;
    }
  }
});

userSchema.pre('remove', async function (next) {
  try {
    const places = await Place.find({ creatorId: this._id });
    places &&
      places.length > 0 &&
      places.forEach((place) => {
        fs.unlink(
          path.resolve(__dirname, '..', '..', 'uploads', place.imageUrl),
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      });
    await Place.deleteMany({ creatorId: this._id });
    return next();
  } catch (error) {
    console.log(error);
    return next(new HttpError('Could not delete places for that user', 500));
  }
});

userSchema.statics.findByCredentials = async (email, password, next) => {
  let user;
  try {
    user = await User.findOne({ email });
    if (!user) {
      return next(new HttpError('Wrong email/password', 404));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new HttpError('Wrong email/password', 404));
    }
    return user;
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

userSchema.methods.generateAuthenticationToken = function () {
  let token;
  try {
    token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return token;
  } catch (error) {
    throw error;
  }
};

userSchema.methods.toJSON = function () {
  const userObj = this.toObject({ getters: true });
  delete userObj.password;
  // delete userObj.imageUrl;
  delete userObj['__v'];
  delete userObj['_id'];
  delete userObj.createdAt;
  delete userObj.updatedAt;
  userObj.userId = userObj.id;
  delete userObj.id;
  return userObj;
};

const User = mongoose.model('user', userSchema);

export default User;
