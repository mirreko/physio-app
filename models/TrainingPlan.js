const mongoose = require("mongoose");

const TrainingPlanSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
      title: {
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
    },
  ],
  frequency: {
    type: Number, 
    default: 3,
  },
  durationWeeks: {
    type: Number, 
    default: 4,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TrainingPlan", TrainingPlanSchema);