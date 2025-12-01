import jwt from "jsonwebtoken";

export const jwtCheck = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No Authorization header OR missing Bearer prefix
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach user info for controllers

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};
