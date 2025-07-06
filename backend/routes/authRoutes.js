// routes/authRouter.js

import express from 'express';
import { signup, login, logout } from '../controlers/auth.controler.js'; 

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Logout Route
router.post('/logout', logout);

export default router;
