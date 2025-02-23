const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");
const User = require("../models/User");
const TrainingPlan = require("../models/TrainingPlan");

// @route    GET /api/exercises
// @desc     Alle verfügbaren Übungen abrufen
// @access   Öffentlich (alle können die Übungen sehen)
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find(); 
    res.json(exercises); 
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

router.post("/complete", async (req, res) => {
  const { userId, completedDate } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const completedDateObj = new Date(completedDate);

    const pointsEarned = 10; 
    user.points += pointsEarned;

    const lastWorkoutDate = new Date(user.lastWorkoutDate);
    const isNextDay = (completedDateObj - lastWorkoutDate) / (1000 * 60 * 60 * 24) === 1;

    if (isNextDay) {
      user.streak += 1;
    } else if (completedDateObj > lastWorkoutDate) {
      user.streak = 1; 
    }

    user.lastWorkoutDate = completedDateObj;

    const newBadges = [];
    const allBadges = await Badge.find(); 

    allBadges.forEach((badge) => {
      const condition = badge.condition;

      if (
        (condition === "streak >= 7" && user.streak >= 7) ||
        (condition === "streak >= 14" && user.streak >= 14) ||
        (condition === "streak >= 30" && user.streak >= 30) ||
        (condition === "weekly_goal_completed" && user.weeklyGoalCompleted) ||
        (condition === "monthly_goal_completed" && user.monthlyGoalCompleted)
      ) {
        if (!user.badges.includes(badge.id)) {
          user.badges.push(badge.id);
          newBadges.push(badge);
        }
      }
    });

    await user.save();

    res.json({
      message: "Workout erfolgreich abgeschlossen!",
      points: user.points,
      streak: user.streak,
      newBadges,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Serverfehler", error: err.message });
  }
});



module.exports = router;
