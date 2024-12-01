const express = require("express");
const router = express.Router();
const TrainingPlan = require("../models/TrainingPlan");
const authMiddleware = require("../middleware/auth");

// @route    POST /api/trainingplans
// @desc     Trainingsplan erstellen oder Übung zu einem bestehenden Trainingsplan hinzufügen
// @access   Privat (nur Physiotherapeuten)
router.post("/", async (req, res) => {
  const { patientId, patientName, exerciseId, title, repetitions, duration, sets } = req.body;

  try {
    // Überprüfen, ob der Trainingsplan bereits existiert
    let trainingPlan = await TrainingPlan.findOne({ patientId });

    if (!trainingPlan) {
      // Wenn kein Trainingsplan existiert, neuen Trainingsplan erstellen
      trainingPlan = new TrainingPlan({
        patientId,
        patientName,
        exercises: [
          {
            exerciseId,
            title,
            repetitions,
            sets,
            duration,
          },
        ],
      });
      await trainingPlan.save();
      return res.status(201).json({ success: true, trainingPlanId: trainingPlan._id });
    } else {
      // Andernfalls die neue Übung zum bestehenden Trainingsplan hinzufügen
      trainingPlan.exercises.push({
        exerciseId,
        title,
        repetitions,
        sets,
        duration,
      });
      await trainingPlan.save();
      return res.json({ success: true, trainingPlanId: trainingPlan._id });
    }
  } catch (error) {
    console.error(error);
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

// @route    PUT /api/trainingplans/:id/exercises
// @desc     Übungen zu einem bestehenden Trainingsplan hinzufügen
// @access   Privat (nur Physiotherapeuten)
router.put("/:id/exercises", async (req, res) => {
  const { exerciseId, title, repetitions, duration, sets } = req.body;

  try {
    let trainingPlan = await TrainingPlan.findById(req.params.id);

    if (!trainingPlan) {
      return res.status(404).json({ msg: "Trainingsplan nicht gefunden" });
    }

    // Neue Übung zum bestehenden Trainingsplan hinzufügen
    trainingPlan.exercises.push({
      exerciseId,
      title,
      repetitions,
      sets,
      duration,
    });

    await trainingPlan.save();
    res.json(trainingPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
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

// @route    DELETE /api/trainingplans/:id
// @desc     Trainingsplan löschen
// @access   Privat (nur Physiotherapeuten)
router.delete("/:id", async (req, res) => {
  try {
    const trainingPlan = await TrainingPlan.findByIdAndDelete(req.params.id); 

    if (!trainingPlan) {
      return res.status(404).json({ msg: "Trainingsplan nicht gefunden" });
    }

    res.json({ msg: "Trainingsplan erfolgreich gelöscht" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

// @route    GET /api/trainingplans/:id
// @desc     Trainingsplan für einen bestimmten Patienten abrufen
// @access   Privat
router.get("/:id", authMiddleware, async (req, res) => {
  const patientId = req.params.id; // ID aus der URL extrahieren
  
  // Überprüfen, ob die ID gültig ist
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({ msg: "Ungültige Benutzer-ID" });
  }

  try {
    const trainingPlan = await TrainingPlan.findOne({ patientId: patientId })
      .populate("exercises.exerciseId");

    if (!trainingPlan) {
      return res.status(404).json({ msg: "Kein Trainingsplan gefunden" });
    }

    res.json(trainingPlan);
  } catch (err) {
    console.error("Error fetching training plan:", err.message);
    return res.status(500).json({ msg: "Serverfehler", error: err.message });
  }
});


// @route    PUT /api/trainingplans/:id/workouts
// @desc     Trainingsplan für einen bestimmten Patienten abrufen
// @access   Privat
router.put('/:id/workouts', async (req, res) => {
  const { id } = req.params; // Trainingsplan-ID aus der URL
  const { frequency } = req.body; // Neuer Wert für den Workout-Counter

  // Validierung des Werts
  if (typeof frequency !== 'number' || frequency < 0) {
    return res.status(400).json({ message: 'Die Häufigkeit (frequency) muss eine positive Zahl sein.' });
  }

  try {
    // Trainingsplan in der Datenbank finden und das Feld frequency aktualisieren
    const trainingPlan = await TrainingPlan.findByIdAndUpdate(
      id,
      { frequency }, // Setze den neuen Wert für frequency
      { new: true } // Rückgabe des aktualisierten Dokuments
    );

    if (!trainingPlan) {
      return res.status(404).json({ message: 'Trainingsplan nicht gefunden.' });
    }

    res.status(200).json({
      message: 'Workout-Counter (frequency) erfolgreich aktualisiert.',
      frequency: trainingPlan.frequency,
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der frequency:', error);
    res.status(500).json({ message: 'Interner Serverfehler.' });
  }
});

module.exports = router;