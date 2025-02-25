const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const Feedback = require("../models/Feedback");
const Badge = require("../models/Badges");

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
router.get("/:id/points", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    res.json({ points: user.points });
  } catch (error) {
    console.error("Fehler beim Abrufen der Punkte:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Route: PUT /api/users/:id/points
router.put("/:id/points", async (req, res) => {
  const { id } = req.params; 
  const { points } = req.body; 

  if (typeof points !== "number") {
    return res.status(400).json({ message: "Punkte müssen eine Zahl sein." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $inc: { points: points } }, 
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }

    res
      .status(200)
      .json({
        message: "Punkte erfolgreich aktualisiert.",
        points: user.points,
      });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Punkte:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
});

// Route: GET /api/users/:id/streak
router.get("/:id/streak", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }

    res.json({ streak: user.streak });
  } catch (error) {
    console.error("Fehler beim Abrufen der Streak:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Route: PUT /api/users/:id/streak
router.put("/:id/streak", async (req, res) => {
  const { id } = req.params;
  const { streak } = req.body;

  if (typeof streak !== "number") {
    return res.status(400).json({ message: "Streak muss eine Zahl sein." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { streak: streak },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }

    res
      .status(200)
      .json({
        message: "Streak erfolgreich aktualisiert.",
        streak: user.streak,
      });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Streak:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Route: PUT /api/users/:id/workouts
router.put("/:id/workouts", async (req, res) => {
  const { id } = req.params;
  const { workoutDate } = req.body; 

  if (!workoutDate) {
    return res.status(400).json({ message: "Workout-Datum ist erforderlich." });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }

    user.workouts.push(new Date(workoutDate));

    const currentDate = new Date();
    let newStreak = user.streak;

    if (
      user.workouts[user.workouts.length - 1].toDateString() ===
      currentDate.toDateString()
    ) {
      newStreak += 1;
    } else {
      newStreak = 1; 
    }

    user.streak = newStreak;
    await user.save();

    res
      .status(200)
      .json({
        message: "Workout erfolgreich aktualisiert",
        streak: user.streak,
        workouts: user.workouts,
      });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Workouts:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// POST-Endpunkt für das Speichern von Feedback
router.post("/feedback", async (req, res) => {
  try {
    const { workoutRating, painRating, completedAt, patientId } = req.body;

    const newFeedback = new Feedback({
      workoutRating,
      painRating,
      completedAt,
      patientId,
    });

    await newFeedback.save();

    res
      .status(201)
      .json({
        message: "Feedback erfolgreich gespeichert!",
        feedback: newFeedback,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// GET-Route zum Abrufen der Feedbacks
router.get("/feedbacks", async (req, res) => {
  try {
    
    const feedbacks = await Feedback.find();

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: "Keine Feedbacks gefunden." });
    }

    res.status(200).json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

router.post("/:id/check-badges", async (req, res) => {
  const { id: patientId } = req.params;
  
  try {
    const user = await User.findById(patientId).populate("badges.badgeId");
    const badges = await Badge.find();
    const newBadges = [];

    for (const badge of badges) {
      const alreadyEarned = user.badges.some(
        (b) => b.badgeId._id.toString() === badge._id.toString()
      );

      if (!alreadyEarned) {
        const criteria = badge.criteria;

        if (
          (criteria.streak && user.streak >= criteria.streak) ||
          (criteria.points && user.points >= criteria.points)
        ) {
          newBadges.push({ badgeId: badge._id, awardedAt: new Date() });
        }
      }
    }

    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
      await user.save();
    }
    res.status(200).json({ newBadges });
  } catch (error) {
    console.error("Fehler bei der Badge-Überprüfung:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});


router.get("/:id/badges", async (req, res) => {
  const { id: userId } = req.params;

  try {
    const user = await User.findById(userId).populate("badges.badgeId"); 
    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }

    res.status(200).json(user.badges);
  } catch (error) {
    console.error("Fehler beim Abrufen der Badges:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});


module.exports = router;
