const express = require("express");
const Badge = require("../models/Badges"); 
const router = express.Router();

// get all badges
router.get("/", async (req, res) => {
  try {
    const badges = await Badge.find(); 
    res.json(badges);  
  } catch (err) {
    console.error("Fehler beim Abrufen der Badges:", err.message);
    res.status(500).json({ error: "Fehler beim Abrufen der Badges" });
  }
});

module.exports = router;
