const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// @route    GET /api/users
// @desc     Alle Benutzer abrufen
// @access   Öffentlich
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    console.log("Fetching user for ID:", req.user?.id); // Log to verify if `req.user` is set
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Serverfehler");
  }
});

// Route: GET /api/users/:id/points
router.get('/:id/points', async (req, res) => {
  const { id } = req.params;

  try {
    // Benutzer aus der Datenbank holen
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    // Punkte des Benutzers zurückgeben
    res.json({ points: user.points });
  } catch (error) {
    console.error('Fehler beim Abrufen der Punkte:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

module.exports = router;
