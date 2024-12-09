// migrateUsers.js
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.updateMany(
      { $or: [{ workouts: { $exists: false } }, { points: { $exists: false } }, { streak: { $exists: false } }] }, // Nutzer ohne neue Felder
      {
        $set: {
          workouts: [],      // Standardwert für Workouts
          badges: [],        // Standardwert für Badges
          points: 0,         // Standardwert für Punkte
          streak: 0,         // Standardwert für Streak
        },
      }
    );

    console.log("Migration erfolgreich abgeschlossen");
    mongoose.disconnect();
  } catch (error) {
    console.error("Fehler bei der Migration:", error);
    mongoose.disconnect();
  }
}

migrateUsers();
