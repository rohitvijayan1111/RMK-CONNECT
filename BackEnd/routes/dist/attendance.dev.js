"use strict";

var express = require('express');

var router = express.Router();

var db = require('../config/db');

var util = require('util');

var moment = require('moment');

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

router.post('/addabsent', function _callee(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = req.body;

          if (data) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Data is required'
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(db.query('INSERT INTO absent_attendance_records SET ?', [data]));

        case 6:
          res.json({
            message: 'Record inserted successfully'
          });
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](3);
          console.error('Error inserting record:', _context.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
router.post('/removeabsent', function _callee2(req, res) {
  var _req$body, date, rollnumber, userGroup, column, query;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, date = _req$body.date, rollnumber = _req$body.rollnumber, userGroup = _req$body.userGroup;

          if (!(!date || !rollnumber || !userGroup)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Date, Roll Number, and User Group are required'
          }));

        case 3:
          console.log(userGroup);
          column = userGroup === 'Student' ? 'student_id' : 'staff_id';
          query = "DELETE FROM absent_attendance_records WHERE attendance_date=? AND ".concat(column, "=?");
          db.query(query, [date, rollnumber], function (error, result) {
            if (error) {
              console.error('Error removing record:', error);
              return res.status(500).json({
                error: 'Error removing record'
              });
            }

            console.log(result);

            if (result.affectedRows === 0) {
              return res.status(404).json({
                error: 'Record not found'
              });
            }

            res.json({
              message: 'Record removed successfully'
            });
          });

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.post('/fetchtoday', function _callee3(req, res) {
  var _req$body2, date, userGroup, column, query;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, date = _req$body2.date, userGroup = _req$body2.userGroup;

          if (!(!date || !userGroup)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Date and User Group are required'
          }));

        case 3:
          column = userGroup === 'Student' ? 'student_id' : 'staff_id';
          query = "SELECT * FROM absent_attendance_records WHERE attendance_date=? AND ".concat(column, "=?");
          db.query(query, [date, NULL], function (error, result) {
            if (error) {
              console.error('Error removing record:', error);
              return res.status(500).json({
                error: getFriendlyErrorMessage(error)
              });
            }

            console.log(result);

            if (result.length === 0) {
              return res.status(404).json({
                error: 'No Records Found'
              });
            }

            res.json({
              message: 'Record fetched successfully'
            });
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = router;
module.exports = router;