const express = require('express');
const router = express.Router();
const bb = require('../models/admins');

// Default PIN
const DEFAULT_PIN = '1234';

// Registration route
router.post('/register', async (req, res) => {
  try {
    const administrator = new bb({
      username: req.body.username,
      pin: DEFAULT_PIN
    });
    const savedAdministrator = await administrator.save();
    res.status(201).send(savedAdministrator);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const administrator = await bb.findOne({ username: req.body.username, pin: req.body.pin });
    if (!administrator) {
      return res.status(400).send('Invalid username or PIN');
    }
    res.send('Login successful');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
