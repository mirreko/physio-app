const mongoose = require("mongoose");
const Badge = require("./models/Badges");
require("dotenv").config();

// Verbindungsaufbau zur MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB verbunden");
  } catch (error) {
    console.error("Fehler bei der MongoDB Verbindung:", error.message);
    process.exit(1);
  }
};

const seedBadges = async () => {
  const badges = [
    {
      id: "streak_7_days",
      name: "Consistency Starter",
      description: "Erhalte diesen Badge, wenn du 7 Tage hintereinander Übungen gemacht hast.",
      condition: "streak >= 7",
      imageUrl: "/src/assets/gamipress-icon-star.png",
    },
    {
      id: "streak_14_days",
      name: "Two-Week Wonder",
      description: "Absolviere 14 Tage in Folge Übungen.",
      condition: "streak >= 14",
      imageUrl: "/src/assets/gamipress-icon-minus.png",
    },
    {
      id: "streak_30_days",
      name: "Habit Hero",
      description: "Halte eine 30-Tage-Streak aufrecht.",
      condition: "streak >= 30",
      imageUrl: "/src/assets/gamipress-icon-add.png",
    },
    {
      id: "week_completed",
      name: "Week Warrior",
      description: "Schließe alle Workouts eines Wochenplans ab.",
      condition: "weekly_goal_completed",
      imageUrl: "/src/assets/gamipress-icon-star.png",
    },
    {
      id: "month_completed",
      name: "Month Achiever",
      description: "Absolviere alle Workouts über 4 Wochen hinweg.",
      condition: "monthly_goal_completed",
      imageUrl: "/src/assets/gamipress-icon-minus.png",
    },
    // Weitere Badges hinzufügen ...
  ];

  try {
    await Badge.insertMany(badges);
    console.log("Badges erfolgreich hinzugefügt!");
    process.exit(0);
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Badges:", error.message);
    process.exit(1);
  }
};

connectDB().then(seedBadges);
