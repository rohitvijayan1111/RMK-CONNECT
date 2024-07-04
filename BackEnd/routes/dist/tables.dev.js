"use strict";

var express = require('express');

var router = express.Router();

var db = require('../config/db');

router.post('/gettable', function _callee(req, res) {
  var _req$body, table, dept, query, values;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Received request:", req.body);
          _req$body = req.body, table = _req$body.table, dept = _req$body.dept;

          if (!(!table || !dept)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).send("Please provide both table and dept parameters."));

        case 4:
          query = 'SELECT * FROM ?? WHERE dept = ?';
          values = [table, dept];
          db.query(query, values, function (err, results) {
            if (err) {
              console.error(err);
              return res.status(500).send('Server error and is in debug');
            }

            if (results.length === 0) {
              return res.status(404).send('No records found');
            }

            res.status(200).json(results);
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});
router["delete"]('/deleterecord', function (req, res) {
  var _req$body2 = req.body,
      id = _req$body2.id,
      table = _req$body2.table; // Get table and id from request body

  if (!table || !id) {
    return res.status(400).json({
      error: 'Table name and ID are required'
    });
  }

  console.log("Deleting from ".concat(table, " where id=").concat(id));
  db.query('DELETE FROM ?? WHERE id = ?', [table, id], function (err, result) {
    if (err) {
      console.error('Error deleting item:', err.stack);
      res.status(500).json({
        error: 'Database error'
      });
      return;
    }

    res.json({
      message: 'Item deleted successfully'
    });
  });
});
module.exports = router;