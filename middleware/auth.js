const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrierung
router.post('/register', async (req, res) => {
  const { name, email, password, isPhysiotherapist } = req.body;

  try {
    // Überprüfen, ob der Benutzer bereits existiert
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Benutzer existiert bereits' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen Benutzer erstellen
    user = new User({
      name,
      email,
      password: hashedPassword,
      isPhysiotherapist, // isPhysiotherapist speichern
    });

    await user.save();

    // Token generieren
    const token = jwt.sign({ id: user._id, isPhysiotherapist: user.isPhysiotherapist }, 'dein_jwt_geheimnis', {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Benutzer erfolgreich registriert',
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;
