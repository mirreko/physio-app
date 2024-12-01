const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isPhysiotherapist: {
      type: Boolean,
      default: false,
    },
    badges: {
      type: [String],
      default: [],
    },
    points: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    workouts: {
      type: [Date],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
