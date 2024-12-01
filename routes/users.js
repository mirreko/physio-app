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

// Route: PUT /api/users/:id/points
router.put('/:id/points', async (req, res) => {
  const { id } = req.params; // Benutzer-ID aus der URL
  const { points } = req.body; // Neue Punkte aus der Anfrage

  if (typeof points !== 'number') {
    return res.status(400).json({ message: 'Punkte müssen eine Zahl sein.' });
  }

  try {
    // Benutzer in der Datenbank finden und Punkte aktualisieren
    const user = await User.findByIdAndUpdate(
      id,
      { $inc: { points: points } }, // Punkte inkrementieren
      { new: true } // Rückgabe des aktualisierten Dokuments
    );

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    res.status(200).json({ message: 'Punkte erfolgreich aktualisiert.', points: user.points });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Punkte:', error);
    res.status(500).json({ message: 'Interner Serverfehler.' });
  }
});

// Route: GET /api/users/:id/streak
router.get('/:id/streak', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    res.json({ streak: user.streak });
  } catch (error) {
    console.error('Fehler beim Abrufen der Streak:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Route: PUT /api/users/:id/streak
router.put('/:id/streak', async (req, res) => {
  const { id } = req.params;
  const { streak } = req.body;

  if (typeof streak !== 'number') {
    return res.status(400).json({ message: 'Streak muss eine Zahl sein.' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { streak: streak },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    res.status(200).json({ message: 'Streak erfolgreich aktualisiert.', streak: user.streak });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Streak:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

module.exports = router;
