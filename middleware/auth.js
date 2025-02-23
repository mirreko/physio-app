// authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // call token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
