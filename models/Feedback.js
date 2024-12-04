const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  workoutRating: {
    type: Number,
    
    min: 0,
    max: 10
  },
  painRating: {
    type: Number,
    
    min: 0,
    max: 10
  },
  completedAt: {
    type: Date,
    
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    
  }
});

// Modell exportieren, damit es in der DB genutzt werden kann
module.exports = mongoose.model('Feedback', FeedbackSchema);
