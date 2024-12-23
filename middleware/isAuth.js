const JWT = require("jsonwebtoken");

const isAuth = (req, res, next) => {
    try {
        // Extract the token from Authorization header
        const header = req.headers["Authorization"] || req.headers["authorization"];
        if (!header) {
            const error = new Error("Token is required");
            error.statusCode = 401
            return next(error);
        }

        const token = header.split(" ")[1];
        if (!token) {
            const error = new Error("Token format is invalid");
            error.statusCode = 401
            return next(error);
        }

        // Verify the JWT token
        try {
            const currentUser = JWT.verify(token, process.env.JWT_SECRET_KEY);            
            req.currentUser = currentUser; // Attach the user information to the request object
            return next(); // Proceed to the next middleware
        } catch (err) {
            // Handle invalid or expired token errors
            const error = new Error("Invalid or expired token");
            error.statusCode = 401
            return next(error);
        }

    } catch (err) {
        // Catch any unexpected errors
        const error = new Error("Authentication failed");
        error.statusCode = 401
        return next(error);
    }
}

module.exports = isAuth;