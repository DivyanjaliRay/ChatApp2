// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const authMiddleware = async (req, res, next) => {
    try {
        // Check for token in cookies first
        let token = req.cookies.token;
        // If not in cookies, check Authorization header
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;