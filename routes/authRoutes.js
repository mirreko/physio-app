// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Registrierung
router.post("/register", async (req, res) => {
  const { name, email, password, isPhysiotherapist } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Bitte alle Felder ausfüllen" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Benutzer existiert bereits" });
    }

    user = new User({
      name,
      email,
      password,
      isPhysiotherapist,
    });

    // Passwort verschlüsseln
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Payload für den Token
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Token erstellen
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Stelle sicher, dass JWT_SECRET in deiner .env-Datei gesetzt ist
      { expiresIn: "1h" }, // Token läuft nach einer Stunde ab
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Token als Antwort senden
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
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

module.exports = router;

const auth = require("../middleware/auth");

// Geschützte Route, um den aktuellen Benutzer zu erhalten
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverfehler");
  }
});

