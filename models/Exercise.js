const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description_1: {
    type: String,
    required: true,
  },
  repetitions: {
    type: Number,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number, // Dauer in Sekunden oder Minuten
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Leicht", "Mittel", "Schwierig"], // Schwierigkeitsgrad
    default: "Mittel",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("exercise", ExerciseSchema);
