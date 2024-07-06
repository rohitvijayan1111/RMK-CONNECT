"use strict";

var express = require('express');

var bcrypt = require('bcryptjs');

var db = require('../config/db');

var router = express.Router(); // Register endpoint

router.post('/register', function _callee2(req, res) {
  var _req$body, username, password, role, department;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password, role = _req$body.role, department = _req$body.department;
          console.log(department);

          if (!(!username || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("Enter all fields"));

        case 4:
          db.query('SELECT * FROM users WHERE username = ?', [username], function _callee(err, results) {
            var hashedPassword, sql;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 3;
                      break;
                    }

                    console.error(err);
                    return _context.abrupt("return", res.status(500).send('Server error'));

                  case 3:
                    if (!(results.length > 0)) {
                      _context.next = 5;
                      break;
                    }

                    return _context.abrupt("return", res.status(400).send('User already exists'));

                  case 5:
                    userDepartment = department;

                    if (department == 'na') {
                      userDepartment = role;
                    }

                    _context.next = 9;
                    return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

                  case 9:
                    hashedPassword = _context.sent;
                    sql = 'INSERT INTO users (username, password, role,department) VALUES (?, ?, ?,?)';
                    db.query(sql, [username, hashedPassword, role, userDepartment], function (err, result) {
                      if (err) {
                        console.error(err);
                        return res.status(500).send('Server error');
                      }

                      res.status(201).send('User registered');
                    });

                  case 12:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Login endpoint

router.post('/login', function (req, res) {
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;
  console.log('Received login request for username:', username);

  if (!username || !password) {
    return res.status(400).send("Enter all fields");
  }

  var sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], function _callee3(err, results) {
    var user, isMatch, responseData;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!err) {
              _context3.next = 3;
              break;
            }

            console.error(err);
            return _context3.abrupt("return", res.status(500).send('Server error'));

          case 3:
            if (!(results.length === 0)) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt("return", res.status(400).send('Invalid credentials'));

          case 5:
            user = results[0];
            _context3.next = 8;
            return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

          case 8:
            isMatch = _context3.sent;

            if (isMatch) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt("return", res.status(400).send('Invalid credentials'));

          case 11:
            responseData = {
              username: user.username,
              role: user.role,
              department: user.department
            }; // Send the response as JSON

            res.status(200).json(responseData);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
});
module.exports = router;