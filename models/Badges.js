const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: String, // Speichert die Bedingung als String
    required: true,
  },
  imageUrl: { // URL oder Dateipfad des Badge-Bilds
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Badge", BadgeSchema);
