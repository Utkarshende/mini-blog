// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken'); // Assuming you use the 'jsonwebtoken' package

// Get your secret key from the environment variables (MUST match the key used for signing)
const JWT_SECRET = process.env.JWT_SECRET; 

const authMiddleware = (req, res, next) => {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization; 

    // 2. Check if the header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401: Unauthorized - No token found
        return res.status(401).json({ 
            success: false, 
            message: 'Access Denied. No token provided.' 
        });
    }

    // 3. Extract the token (everything after 'Bearer ')
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        // 5. Attach the decoded user data (e.g., user ID) to the request object
        // This 'userId' is what your controller will use to find the posts.
        req.userId = decoded.id; // Assuming your JWT payload includes 'id'
        
        // 6. Token is valid, continue to the next handler/controller
        next(); 

    } catch (ex) {
        // 401: Unauthorized - Token is invalid or expired
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token.' 
        });
    }
};

module.exports = authMiddleware;