const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, password, role,department} = req.body;
  if(!username || !password)
    {
      return res.status(400).send("Enter all fields");  
    }
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    if (results.length > 0) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (username, password, role,department) VALUES (?, ?, ?,?)';
    db.query(sql, [username, hashedPassword, role,department], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.status(201).send('User registered' );
    });
  });
});

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request for username:', username);
  if(!username || !password)
  {
      return res.status(400).send("Enter all fields");  
  }
  
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(400).send('Invalid credentials' );
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials' );
    }
    const responseData = {
      username: user.username,
      role: user.role,
      department:user.department
    };
    
    // Send the response as JSON
    res.status(200).json(responseData);
  });
});

module.exports = router;
