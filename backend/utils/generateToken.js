// utils/generateToken.js

import jwt from 'jsonwebtoken'; // Import jsonwebtoken

/**
 * @desc    Generates a JWT token and sets it as an HTTP-only cookie
 * @param   {String} userId - The unique identifier of the user
 * @param   {Object} res - The Express response object
 * @returns {String} The generated token
 */
export const generateTokenAndSetCookie = (userId, res) => {
    // Define the payload with the user's ID
    const payload = { userId }; // Changed from 'id' to 'userId' to match the middleware

    // Sign the JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // Ensures HTTPS in production
        sameSite: 'Lax', // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        path: '/', // Cookie path
    });

    return token; // Return the token for the frontend
};
