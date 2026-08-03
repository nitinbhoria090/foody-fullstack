const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        // Get Authorization Header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Extract Token
        const token = authHeader.split(" ")[1];

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save user data in request
        req.user = decoded;

        // Move to next middleware/controller
        next();

    } catch (error) {
    console.log("AUTH ERROR NAME:", error.name);
    console.log("AUTH ERROR MSG:", error.message);
    return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
    });
}
    
};

module.exports = authMiddleware;