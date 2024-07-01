const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(sql, [username, hashedPassword, role], (err, result) => {
      if (err) throw err;
      res.status(201).send('User registered');
    });
  });
});

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WH   ERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(400).send('Invalid credentials');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    res.send('Login successful');
  });
});

module.exports = router;
