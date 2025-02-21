const mongoose = require('mongoose');
const Feedback = require('./models/Feedback'); 
require("dotenv").config(); 

// Verbindungsaufbau zur MongoDB
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB verbunden");
    } catch (error) {
      console.error("Fehler bei der MongoDB Verbindung:", error.message);
      process.exit(1);
    }
  };

