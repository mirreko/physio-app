// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const auth = require("../middleware/auth");

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

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Bitte alle Felder ausfüllen" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Benutzer existiert nicht" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Ungültige Anmeldedaten" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

// Geschützte Route, um den aktuellen Benutzer zu erhalten
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id);
    if (!user) {
      return res.status(404).json({ msg: "Benutzer nicht gefunden" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

module.exports = router;
