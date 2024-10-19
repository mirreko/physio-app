const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrierung
router.post('/register', async (req, res) => {
  const { name, email, password, isPhysiotherapist } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Bitte alle Felder ausfüllen" });
  }

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

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the correct secret
    req.user = decoded.user; // Assuming your JWT has `{ user: { id: "someId" } }`
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};