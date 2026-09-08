import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        // 1. Access cookies using req.cookies (plural)
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No Token Provided"
            });
        }

        // 2. Verify token (throws an error if invalid/expired)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Fetch user matching decoded token payload (exclude password)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 4. Attach user object to request and pass control to next middleware
        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);

        // Handle specific JWT error cases with a 401 status code
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Unauthorized - Invalid or Expired Token"
            });
        }

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
