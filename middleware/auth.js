// authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Token aus dem Header abrufen
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Überprüfen, ob kein Token vorhanden ist
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Token verifizieren
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Setze die dekodierten Informationen in req.user
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
