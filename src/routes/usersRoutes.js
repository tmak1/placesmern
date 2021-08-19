import express from 'express';
import { check } from 'express-validator';

import { fileUploadUsers } from '../middleware/fileUpload.js';

const router = express.Router();

router
  .get('/', getAllUsers)
  .get('/:uid', getUserById)
  .post(
    '/signup',
    fileUploadUsers.single('image'), // image is the id of the Image upload input on the front end
    [
      check('name').trim().not().isEmpty(),
      check('email').trim().isEmail(),
      check('password').trim().isLength({ min: 3 }),
    ],
    signup
  )
  .post(
    '/login',
    [
      check('email').isEmail().not().isEmpty(),
      check('password').isLength({ min: 3 }).not().isEmpty(),
    ],
    login
  )
  .patch(
    '/:uid',
    [
      check('name').not().isEmpty(),
      check('email').isEmail().not().isEmpty(),
      check('password').isLength({ min: 3 }).not().isEmpty(),
    ],
    updateUserById
  )
  .delete('/:uid', deleteUserById);

import {
  getAllUsers,
  getUserById,
  signup,
  login,
  updateUserById,
  deleteUserById,
} from '../controllers/usersController.js';

export default router;
