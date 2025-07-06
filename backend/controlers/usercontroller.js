// controllers/userController.js

import User from '../models/usermodel.js'; // Adjust the path as needed

/**
 * @desc    Get All Users
 * @route   GET /api/users
 * @access  Protected
 */
export const getAllUsers = async (req, res) => {
    try {
        // Get the current user's ID from the request (set by auth middleware)
        const currentUserId = req.user._id;

        // Fetch all users except the current user, excluding the password field
        const users = await User.find({ _id: { $ne: currentUserId } })
            .select('-password')
            .lean(); // Use lean() for better performance

        // If no users are found, return an empty array
        if (!users || users.length === 0) {
            return res.status(200).json([]);
        }

        // Format the user data
        const formattedUsers = users.map(user => ({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`,
            gender: user.gender,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            message: error.message || "Something went wrong while fetching users" 
        });
    }
};

/**
 * @desc    Get Single User by ID
 * @route   GET /api/users/:id
 * @access  Protected
 */
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Basic validation for userId
        if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        // Fetch user by ID, excluding the password field
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Format the user data
        const formattedUser = {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`,
            gender: user.gender,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json(formattedUser);
    } catch (error) {
        console.error("Error fetching user:", error.message);

        // Handle specific Mongoose CastError for invalid ID
        if (error.name === 'CastError') {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        res.status(500).json({ 
            error: "Internal Server Error",
            message: error.message || "Something went wrong while fetching the user" 
        });
    }
};