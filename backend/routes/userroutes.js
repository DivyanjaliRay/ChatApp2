// routes/userRouter.js

import express from 'express';
import { getAllUsers, getUserById } from '../controlers/usercontroller.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Ensure authentication

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

// GET /api/users - Fetch all users
router.get('/', getAllUsers);

// GET /api/users/:id - Fetch user by ID
router.get('/:id', getUserById);

export default router;
