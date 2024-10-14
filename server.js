// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const exercisesRouter = require("./routes/exercises");
const usersRoute = require("./routes/users"); 

// Initialisiere express und lade Umgebungsvariablen
dotenv.config();
const app = express();

// CORS aktivieren
app.use(cors());
// Middleware
app.use(express.json()); // Um JSON-Daten im Request-Body zu verarbeiten

app.use((err, req, res, next) => {
  console.error(err.stack); // Detaillierte Fehlerausgabe im Terminal
  res.status(500).json({ error: "Serverfehler" });
});

// Einfache Route zum Testen
app.get("/", (req, res) => {
  res.send("Hello World, der Server läuft!");
});

// Routen
app.use("/api/exercises", exercisesRouter);
app.use("/api/users", usersRoute);

// Starte den Server auf Port 5500
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

// server.js
const mongoose = require("mongoose");

// Verbindungsfunktion für MongoDB
// Verbindungsfunktion für MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB verbunden");
  } catch (error) {
    console.error("Fehler bei der MongoDB Verbindung:", error.message);
    process.exit(1); // Beende den Prozess bei Fehler
  }
};

// Rufe die Verbindungsfunktion auf
connectDB();

// User Authentifikation
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Übungen importieren
const exercises = require("./routes/exercises");
app.use("/api/exercises", exercises);

// Trainingsplaene importieren
const trainingPlans = require("./routes/trainingPlans");
app.use("/api/trainingplans", trainingPlans);
