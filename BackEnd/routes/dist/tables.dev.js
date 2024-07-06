"use strict";

var express = require('express');

var router = express.Router();

var db = require('../config/db');

var util = require('util');

var moment = require('moment');

var query = util.promisify(db.query).bind(db);
router.post('/gettable', function _callee(req, res) {
  var _req$body, table, dept, sql, values, results;

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
          sql = 'SELECT * FROM ?? WHERE dept = ?';
          values = [table, dept];
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(query(sql, values));

        case 9:
          results = _context.sent;

          if (!(results.length === 0)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(404).send('No records found'));

        case 12:
          res.status(200).json(results);
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](6);
          console.error(_context.t0);
          return _context.abrupt("return", res.status(500).send('Server error and is in debug'));

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 15]]);
});
router.put('/updaterecord', function _callee2(req, res) {
  var _req$body2, id, data, table, existingRows;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, id = _req$body2.id, data = _req$body2.data, table = _req$body2.table;

          if (!(!id || !data || !table)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Id, data, and table are required'
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(query('SELECT * FROM ?? WHERE id = ?', [table, id]));

        case 6:
          existingRows = _context2.sent;

          if (!(existingRows.length === 0)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 9:
          if (data.createdAt) {
            data.createdAt = moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss');
          }

          if (data.deadline) {
            data.deadline = moment(data.deadline).format('YYYY-MM-DD HH:mm:ss');
          }

          _context2.next = 13;
          return regeneratorRuntime.awrap(query('UPDATE ?? SET ? WHERE id = ?', [table, data, id]));

        case 13:
          res.json({
            message: 'Record updated successfully'
          });
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](3);
          console.error('Error updating record:', _context2.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 16]]);
});
router.post('/insertrecord', function _callee3(req, res) {
  var _req$body3, data, table;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, data = _req$body3.data, table = _req$body3.table;

          if (!(!data || !table)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Data and table are required'
          }));

        case 3:
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(query('INSERT INTO ?? SET ?', [table, data]));

        case 6:
          res.json({
            message: 'Record inserted successfully'
          });
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](3);
          console.error('Error inserting record:', _context3.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
router["delete"]('/deleterecord', function _callee4(req, res) {
  var _req$body4, id, table;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body4 = req.body, id = _req$body4.id, table = _req$body4.table;

          if (!(!table || !id)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          console.log("Deleting from ".concat(table, " where id=").concat(id));
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(query('DELETE FROM ?? WHERE id = ?', [table, id]));

        case 7:
          res.json({
            message: 'Item deleted successfully'
          });
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](4);
          console.error('Error deleting item:', _context4.t0.stack);
          res.status(500).json({
            error: 'Database error'
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
router.post('/locktable', function _callee5(req, res) {
  var _req$body5, id, lock;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body5 = req.body, id = _req$body5.id, lock = _req$body5.lock;

          if (!(!id || lock === undefined)) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'ID and lock status are required'
          }));

        case 3:
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(query('UPDATE form_locks SET is_locked = ? WHERE id = ?', [lock, id]));

        case 6:
          res.json({
            message: 'Item lock status updated successfully'
          });
          _context5.next = 13;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](3);
          console.error('Error updating lock status:', _context5.t0.stack);
          res.status(500).json({
            error: 'Database error'
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 9]]);
}); // Endpoint to get lock status of a record

router.post('/getlocktablestatus', function _callee6(req, res) {
  var _req$body6, id, table, results;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body6 = req.body, id = _req$body6.id, table = _req$body6.table;

          if (!(!table || !id)) {
            _context6.next = 3;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context6.prev = 3;
          _context6.next = 6;
          return regeneratorRuntime.awrap(query('SELECT is_locked FROM ?? WHERE id=?', [table, id]));

        case 6:
          results = _context6.sent;

          if (results.length > 0) {
            res.status(200).json(results[0]);
          } else {
            res.status(404).json({
              error: 'Record not found'
            });
          }

          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](3);
          console.error('Failed to fetch lock status:', _context6.t0.stack);
          res.status(500).json({
            error: 'Database error'
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 10]]);
});
module.exports = router;