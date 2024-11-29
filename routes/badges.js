const express = require("express");
const Badge = require("../models/Badges"); // Importiere das Badge-Modell
const router = express.Router();

// Route: Alle Badges abrufen
router.get("/", async (req, res) => {
  try {
    const badges = await Badge.find(); // Alle Badges aus der Datenbank abrufen
    res.json(badges);  // Badges als JSON zurückgeben
  } catch (err) {
    console.error("Fehler beim Abrufen der Badges:", err.message);
    res.status(500).json({ error: "Fehler beim Abrufen der Badges" });
  }
});

module.exports = router;
