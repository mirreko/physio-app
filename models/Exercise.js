const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
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
    type: Number, 
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Leicht", "Mittel", "Schwierig"], 
    default: "Mittel",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  imgUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("exercise", ExerciseSchema);
