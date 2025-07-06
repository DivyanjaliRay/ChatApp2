import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

const protectRoute = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        // Get user from token
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Set user in request
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware: ", error.message);
        res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
};

export default protectRoute; 