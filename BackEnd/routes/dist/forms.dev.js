"use strict";

var express = require('express');

var router = express.Router();

var db = require('../config/db');

var cors = require('cors'); // Allow requests from all origins


router.use(cors());

var getFriendlyErrorMessage = function getFriendlyErrorMessage(errCode) {
  switch (errCode) {
    case 'ER_NO_SUCH_TABLE':
      return "Table does not exist.";

    case 'ER_DUP_ENTRY':
      return "Duplicate entry for a key.";

    case 'ER_BAD_FIELD_ERROR':
      return "Unknown column.";

    case 'ER_PARSE_ERROR':
      return "Error in SQL syntax.";

    case 'ER_NO_REFERENCED_ROW_2':
      return "Referenced entry does not exist.";

    case 'ER_ROW_IS_REFERENCED_2':
      return "Cannot delete or update a parent row: a foreign key constraint fails.";

    case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
      return "Incorrect value for a field.";

    case 'ER_DATA_TOO_LONG':
      return "Data too long for column.";

    case 'ER_ACCESS_DENIED_ERROR':
      return "Access denied for user.";

    case 'ER_NOT_SUPPORTED_YET':
      return "Feature not supported yet.";

    case 'ER_WRONG_VALUE_COUNT_ON_ROW':
      return "Incorrect number of values.";

    default:
      return "An unknown error occurred.";
  }
};

router.post('/getEndIndex', function _callee(req, res) {
  var sql;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Received request:", req.body);
          sql = 'SELECT * FROM FormEndIndex;';
          _context.prev = 2;
          db.query(sql, function (err, results) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
            }

            if (results.length === 0) {
              return res.status(404).send('End index not found');
            }

            console.log('Database results:', results);
            res.status(200).json(results[0]);
          });
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](2);
          console.error('Catch error:', _context.t0.message);
          return _context.abrupt("return", res.status(500).send(getFriendlyErrorMessage(_context.t0.code)));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 6]]);
});
router.post('/createformrecord', function _callee2(req, res) {
  var _req$body, form_name, possible_start_index, Max_index, attributes, parsedAttributes, sql, values;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, form_name = _req$body.form_name, possible_start_index = _req$body.possible_start_index, Max_index = _req$body.Max_index, attributes = _req$body.attributes;
          console.log('Received payload:', req.body);

          if (!(!form_name || !possible_start_index || !Max_index || !attributes)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Missing required fields'
          }));

        case 4:
          _context2.prev = 4;
          parsedAttributes = JSON.parse(attributes);

          if (Array.isArray(parsedAttributes)) {
            _context2.next = 8;
            break;
          }

          throw new Error('Attributes should be an array');

        case 8:
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](4);
          return _context2.abrupt("return", res.status(400).json({
            error: 'Invalid attributes format'
          }));

        case 13:
          sql = 'INSERT INTO Forms (form_name,possible_start_index, Max_index, attributes) VALUES (?, ?, ?, ?)';
          values = [form_name, possible_start_index, Max_index, attributes];

          try {
            db.query(sql, values, function (err, result) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
              }

              res.status(201).send('Form created successfully');
            });
          } catch (err) {
            console.error('Catch error:', err.message);
            res.status(500).send(getFriendlyErrorMessage(err.code));
          }

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
router.post('/getformlist', function _callee3(req, res) {
  var sql;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log("Received request:", req.body);
          sql = 'SELECT * FROM forms;';
          _context3.prev = 2;
          db.query(sql, function (err, results) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
            }

            if (results.length === 0) {
              return res.status(404).send('End index not found');
            }

            console.log('Database results:', results);
            res.status(200).json(results);
          });
          _context3.next = 10;
          break;

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](2);
          console.error('Catch error:', _context3.t0.message);
          return _context3.abrupt("return", res.status(500).send(getFriendlyErrorMessage(_context3.t0.code)));

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 6]]);
});
module.exports = router;