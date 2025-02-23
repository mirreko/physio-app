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
const path = require('path');

dotenv.config();
const app = express();

// activate CORS
app.use(cors({
  origin: "*", 
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Middleware
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ error: "Serverfehler" });
});

app.use("/uploads", express.static("uploads"));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB verbunden");
  } catch (error) {
    console.error("Fehler bei der MongoDB Verbindung:", error.message);
    process.exit(1); 
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World, der Server läuft!");
});

// test route
app.get("/test", (req, res) => {
  res.send("API funktioniert!");
});


// routes
app.use("/api/exercises", exercisesRouter);
app.use("/api/users", usersRoute);
app.use("/api/trainingplans", trainingPlans);
app.use("/api/authRoutes", authRoutes);
app.use("/api/badges", badges);

// start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});





