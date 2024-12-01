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
      name: "Consistency Starter",
      description:
        "Erhalte diesen Badge, wenn du 7 Tage hintereinander Übungen gemacht hast.",
      imageUrl: "/src/assets/badge-star.png",
    },
    {
      name: "Two-Week Wonder",
      description: "Absolviere 14 Tage in Folge Übungen.",
      imageUrl: "/src/assets/badge-minus.png",
    },
    {
      name: "Habit Hero",
      description: "Halte eine 30-Tage-Streak aufrecht.",
      imageUrl: "/src/assets/badge-add.png",
    },
    {
      name: "Week Warrior",
      description: "Schließe alle Workouts eines Wochenplans ab.",
      imageUrl: "/src/assets/badge-heart.png",
    },
    {
      name: "Month Achiever",
      description: "Absolviere alle Workouts über 4 Wochen hinweg.",
      imageUrl: "/src/assets/badge-user.png",
    },
    {
      name: "Plan Champion",
      description:
        "Beende einen kompletten Therapieplan (z. B. 8 oder 12 Wochen).",
      imageUrl: "/src/assets/badge-star.png",
    },
    {
      name: "Pain Fighter",
      description: "Reduziere deine Schmerzbewertung um X% (z. B. 30%).",
      imageUrl: "/src/assets/badge-minus.png",
    },

    {
      name: "Mobility Master",
      description:
        "Melde nach X Wochen eine spürbare Verbesserung deiner Beweglichkeit.",
      imageUrl: "/src/assets/badge-add.png",
    },
    {
      name: "Comeback Kid",
      description:
        "Kehr nach einer Pause (z. B. 1 Woche) zurück und absolviere 3 Workouts hintereinander.",
      imageUrl: "/src/assets/badge-heart.png",
    },
    {
      name: "Repetition Rockstar",
      description: "Absolviere insgesamt 1.000 Wiederholungen von Übungen.",
      imageUrl: "/src/assets/badge-user.png",
    },
    {
      name: "Feedback Friend",
      description: "Gib Feedback nach 10 Workouts.",
      imageUrl: "/src/assets/badge-star.png",
    },
    {
      name: "Early Bird",
      description: "Mache dein erstes Workout vor 8 Uhr morgens.",
      imageUrl: "/src/assets/badge-minus.png",
    },
    {
      name: "Night Owl",
      description: "Mache ein Workout nach 20 Uhr abends.",
      imageUrl: "/src/assets/badge-add.png",
    },
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
