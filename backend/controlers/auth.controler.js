// controllers/auth.controller.js

import bcrypt from 'bcryptjs'; // Using bcryptjs for password hashing
import User from '../models/usermodel.js'; // Adjust the path as needed
import { generateTokenAndSetCookie } from '../utils/generateToken.js'; // Named import

/**
 * @desc    User Signup
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        // Basic validation
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Password confirmation
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Normalize gender
        const normalizedGender = gender.toLowerCase();
        const boyProfilePic = `https://avatar-placeholder.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar-placeholder.iran.liara.run/public/girl?username=${username}`;

        // Create new user instance
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender: normalizedGender,
            profilePic: normalizedGender === "male" ? boyProfilePic : girlProfilePic
        });

        // Save user to the database
        await newUser.save();

        // Generate JWT token and set it in a cookie
        const token = await generateTokenAndSetCookie(newUser._id, res);

        // Respond with user details (excluding password) and token
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
            token // Include the token in the response
        });
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * @desc    User Login
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log(`Login attempt for username: ${username}`);

        // Validate input types
        if (typeof username !== 'string' || typeof password !== 'string') {
            console.log("Invalid input types");
            return res.status(400).json({ error: "Invalid username or password format" });
        }

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Compare provided password with stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Incorrect password");
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Generate JWT token and set it in a cookie
        const token = await generateTokenAndSetCookie(user._id, res);

        console.log("Login successful for user:", username);

        // Respond with user details (excluding password) and token
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            token // Include the token in the response
        });
    } catch (error) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * @desc    User Logout
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
    try {
        // Clear the JWT cookie by setting it to an empty value and expiring it immediately
        res.cookie('token', "", {
            httpOnly: true,
            expires: new Date(0), // Set expiration to a past date
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: '/',
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
