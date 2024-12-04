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

  
// Verbindung zur MongoDB herstellen
mongoose.connect('mongodb://localhost:27017/deineDatenbank', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Datenbank verbunden');
    
    // Beispiel-Dokument für Feedback
    const feedback = new Feedback({
      workoutRating: 8,
      painRating: 3,
      completedAt: new Date(),
      patientId: '603d2f3f92f5b243d4d7c58c'  // Beispiel PatientId, ändere dies nach Bedarf
    });

    // Feedback speichern
    feedback.save()
      .then(() => {
        console.log('Beispiel-Feedback gespeichert!');
        mongoose.connection.close();  // Verbindung schließen nach der Speicherung
      })
      .catch((err) => {
        console.error('Fehler beim Speichern des Feedbacks:', err);
        mongoose.connection.close();
      });

  })
  .catch((error) => {
    console.error('Fehler bei der DB-Verbindung:', error);
  });
