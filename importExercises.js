const mongoose = require("mongoose");
const Exercise = require("./models/Exercise");
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

// Übungen in die DB importieren
const importExercises = async () => {
  const exercises = [
    {
      title: "Kniebeuge",
    description: "Eine klassische Übung zur Stärkung der Beinmuskulatur. Was ist wenn hier eine längere Beschreibung steht? Die kann richtig lang werden und auch mal über mehrere Zeilen gehen...",
    repetitions: 10,
    sets: 3,
    duration: 60,
    difficulty: "Mittel",
    imgUrl: "/src/assets/squads.jpg"
    },
    {
      title: "Liegestütze",
      description: "Trainiert die Brust-, Arm- und Schultermuskulatur.",
      repetitions: 12,
      sets: 3,
      duration: 45,
      difficulty: "Schwierig",
      imgUrl: "/src/assets/push-up.jpeg"
    },
    {
      title: "Plank",
      description: "Eine Übung für den Core-Bereich und die Bauchmuskulatur.",
      repetitions: 1,
      sets: 3,
      duration: 30,
      difficulty: "Leicht",
      imgUrl: "/src/assets/plank.webp"
    },
  ];

  try {
    // Übungen aus der JSON-Datei importieren
    await Exercise.insertMany(exercises);
    console.log("Übungen erfolgreich importiert!");
    process.exit(0);
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Badges:", error.message);
    process.exit(1);
  }
};

// Import-Skript ausführen
connectDB().then(importExercises);
