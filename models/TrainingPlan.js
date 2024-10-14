const mongoose = require("mongoose");

const TrainingPlanSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Hier wird davon ausgegangen, dass du ein User-Modell hast, in dem die Patienten gespeichert sind
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  exercises: [
    {
      exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exercise",
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
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TrainingPlan", TrainingPlanSchema);
