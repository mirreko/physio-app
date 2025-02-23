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
    type: Object, 
    default: {},
  },
  imageUrl: { 
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Badge", BadgeSchema);
