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
      { workouts: { $exists: false } }, // Nur Nutzer ohne die neuen Felder aktualisieren
      {
        $set: {
          workouts: [], // Set 'workouts' field as an empty array
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
