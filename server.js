// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const usersRoute = require("./routes/users");
const exercisesRouter = require("./routes/exercises");
const trainingPlans = require("./routes/trainingPlans");
const mongoose = require("mongoose");
const badges = require("./routes/badges");

// Initialisiere express und lade Umgebungsvariablen
dotenv.config();
const app = express();

// CORS aktivieren
app.use(cors({
  origin: "*", 
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Middleware
app.use(express.json()); // Um JSON-Daten im Request-Body zu verarbeiten

app.use((err, req, res, next) => {
  console.error(err.stack); // Detaillierte Fehlerausgabe im Terminal
  res.status(500).json({ error: "Serverfehler" });
});

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

// Einfache Route zum Testen
app.get("/", (req, res) => {
  res.send("Hello World, der Server läuft!");
});

app.get("/test", (req, res) => {
  res.send("API funktioniert!");
});


// Routen
app.use("/api/exercises", exercisesRouter);
app.use("/api/users", usersRoute);
app.use("/api/trainingplans", trainingPlans);
app.use("/api/authRoutes", authRoutes);
app.use("/api/badges", badges);

// Starte den Server auf Port 5500
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});





