const express = require("express");
const router = express.Router();
const TrainingPlan = require("../models/TrainingPlan");

// @route    POST /api/trainingplans
// @desc     Trainingsplan erstellen
// @access   Privat (nur Physiotherapeuten)
router.post("/", async (req, res) => {
  const { patientId, patientName, exercises } = req.body;

  try {
    const newTrainingPlan = new TrainingPlan({
      patientId,
      patientName,
      exercises,
    });

    const trainingPlan = await newTrainingPlan.save();
    res.status(201).json(trainingPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

// @route    GET /api/trainingplans/:patientId
// @desc     Trainingsplan für einen Patienten abrufen
// @access   Privat (nur Physiotherapeuten)
router.get("/:patientId", async (req, res) => {
  try {
    const trainingPlans = await TrainingPlan.find({
      patientId: req.params.patientId,
    }).populate("exercises.exerciseId"); // Populiert die Übungsdetails

    res.json(trainingPlans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

// @route    PUT /api/trainingplans/:id
// @desc     Trainingsplan aktualisieren
// @access   Privat (nur Physiotherapeuten)
router.put("/:id", async (req, res) => {
  const { exercises } = req.body;

  try {
    let trainingPlan = await TrainingPlan.findById(req.params.id);

    if (!trainingPlan) {
      return res.status(404).json({ msg: "Trainingsplan nicht gefunden" });
    }

    // Update exercises array
    trainingPlan.exercises = exercises;

    await trainingPlan.save();
    res.json(trainingPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

// @route    POST /api/trainingplans
// @desc     Trainingsplan für einen Patienten speichern
// @access   Öffentlich
router.post("/", async (req, res) => {
  const { patientId, pateintName, exerciseId, repetitions, duration, sets } = req.body;

  try {
    const trainingPlan = new TrainingPlan({
      patientId,
      patientName,
      exerciseId,
      repetitions,
      duration,
      sets,
    });

    await trainingPlan.save();
    res.status(201).json(trainingPlan);
  } catch (error) {
    console.error(error);
    res.status(500).send('Serverfehler');
  }
});

// @route    GET /api/trainingplans
// @desc     Alle Trainingspläne abrufen
// @access   Öffentlich
router.get("/", async (req, res) => {
  try {
    const trainingPlans = await TrainingPlan.find().populate("exercises.exerciseId"); // Populiert die Übungsdetails
    res.json(trainingPlans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});


module.exports = router;