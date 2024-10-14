const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");

// @route    GET /api/exercises
// @desc     Alle verfügbaren Übungen abrufen
// @access   Öffentlich (alle können die Übungen sehen)
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find(); // Alle Übungen aus der DB abrufen
    res.json(exercises); // Die Übungen als JSON zurückgeben
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

// @route    GET /api/exercises (mit Filteroptionen)
// @desc     Übungen abrufen
// @access   Öffentlich
router.get("/", async (req, res) => {
  const { bodyPart, condition, healingPhase } = req.query;

  let query = {};

  if (bodyPart) query.bodyPart = bodyPart;
  if (condition) query.condition = condition;
  if (healingPhase) query.healingPhase = healingPhase;

  try {
    const exercises = await Exercise.find(query);
    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

// @route    GET /api/exercises/:id
// @desc     Übung abrufen
// @access   Öffentlich
router.get("/:id", async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).send({ message: "Übung nicht gefunden" });
    }
    res.send(exercise);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Serverfehler" });
  }
});

module.exports = router;
