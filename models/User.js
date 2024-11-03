// models/User.js
const mongoose = require("mongoose");

// Benutzer-Schema
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
      type: [String], // Liste von Badges
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
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
