const mongoose = require("mongoose");
const Exercise = require("./models/Exercise");
const exercisesData = require("./data/exercisesData.json");
require("dotenv").config(); // Um Zugriff auf die DB-Umgebungseinstellungen zu haben

// Verbindung zur MongoDB herstellen
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB verbunden...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Übungen in die DB importieren
const importExercises = async () => {
  try {
    await connectDB();

    // Alle bisherigen Übungen löschen, wenn du sicherstellen willst, dass es keine doppelten Einträge gibt
    await Exercise.deleteMany();

    // Übungen aus der JSON-Datei importieren
    await Exercise.insertMany(exercisesData);

    console.log("Übungen erfolgreich importiert!");
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Import-Skript ausführen
importExercises();
