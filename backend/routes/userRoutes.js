import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const userRoutes = express.Router();

userRoutes.post('/', registerUser);
userRoutes.post('/auth', authUser);
userRoutes.post('/logout', logoutUser);
userRoutes.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)

export default userRoutes;