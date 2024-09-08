const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

const jwtSecret = 'your_jwt_secret_key';
router.post('/register', async (req, res) => {
  const { username, password, role,department} = req.body;
  console.log(department);
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
    userDepartment = department;
    if(department=='na'){
      userDepartment=role;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password, role,department) VALUES (?, ?, ?,?)';
    db.query(sql, [username, hashedPassword, role,userDepartment], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.status(201).send('User registered' );
    });
  });
});


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
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role, department: user.department,mail:user.mail },
      jwtSecret,
      { expiresIn: '1h' } 
    );

    res.status(200).json({ token });
  });
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send('Token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid or expired token');
  }
}

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).send(`Welcome, ${req.user.username}. You are authenticated as ${req.user.role}.`);
});
module.exports = router;
