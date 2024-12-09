const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  criteria: {
    type: Object, // Z. B. { streak: 7, points: 100 }
    default: {},
  },
  imageUrl: { // URL oder Dateipfad des Badge-Bilds
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Badge", BadgeSchema);
