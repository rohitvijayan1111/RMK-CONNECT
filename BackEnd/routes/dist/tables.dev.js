"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var express = require('express');

var router = express.Router();

var db = require('../config/db');

var util = require('util');

var moment = require('moment');

var path = require('path');

var multer = require('multer');

var fs = require('fs');

var query = util.promisify(db.query).bind(db);

var fsPromises = require('fs').promises; // For async operations


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

router.post('/gettable', function _callee(req, res) {
  var table, department, recordSql, columnSql, columnValues, recordValues, columnResults, columnNames, recordResults;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Received request:", req.body);
          table = req.body.table;
          department = req.body.department;

          if (!(!table || !department)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).send("Please provide both table and department parameters."));

        case 5:
          recordSql = 'SELECT * FROM ?? ';

          if (department !== "All") {
            recordSql += 'WHERE department = ?';
          }

          recordSql += 'ORDER BY department';
          columnSql = 'SHOW COLUMNS FROM ??';
          columnValues = [table];
          recordValues = [table, department];
          _context.prev = 11;
          _context.next = 14;
          return regeneratorRuntime.awrap(query(columnSql, columnValues));

        case 14:
          columnResults = _context.sent;
          columnNames = columnResults.map(function (col) {
            return col.Field;
          });
          _context.next = 18;
          return regeneratorRuntime.awrap(query(recordSql, recordValues));

        case 18:
          recordResults = _context.sent;

          if (!(recordResults.length === 0)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            columnNames: columnNames,
            data: []
          }));

        case 21:
          res.status(200).json({
            columnNames: columnNames,
            data: recordResults
          });
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](11);
          console.error(_context.t0.message);
          return _context.abrupt("return", res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          }));

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[11, 24]]);
});
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    var table, dir;
    return regeneratorRuntime.async(function destination$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            table = req.body.table;
            dir = "./uploads/".concat(table);
            _context2.next = 4;
            return regeneratorRuntime.awrap(fsPromises.mkdir(dir, {
              recursive: true
            }));

          case 4:
            cb(null, dir);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  filename: function filename(req, file, cb) {
    var fileName = "".concat(moment().format('YYYYMMDD_HHmmss'), "_").concat(file.originalname);
    cb(null, fileName);
  }
});
var upload = multer({
  storage: storage
});
router.post('/insertrecord', upload.single('file'), function _callee2(req, res) {
  var _req$body, table, data, filePath, friendlyMessage;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, table = _req$body.table, data = _objectWithoutProperties(_req$body, ["table"]);

          if (!(!table || !data)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Data and table are required'
          }));

        case 3:
          _context3.prev = 3;
          filePath = null;

          if (req.file) {
            filePath = req.file.path;
            data.document = filePath;
          }

          _context3.next = 8;
          return regeneratorRuntime.awrap(query('INSERT INTO ?? SET ?', [table, data]));

        case 8:
          res.json({
            message: 'Record inserted successfully'
          });
          _context3.next = 16;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](3);
          console.error('Error inserting record:', _context3.t0);
          friendlyMessage = getFriendlyErrorMessage(_context3.t0.code);
          res.status(500).json({
            error: "".concat(friendlyMessage)
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 11]]);
});
router.post('/updaterecord', upload.single('file'), function _callee3(req, res) {
  var _req$body2, id, table, rawData, data, existingRows, oldFilePath, newFilePath, setClause, values, updateQuery;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log(req.body);
          _req$body2 = req.body, id = _req$body2.id, table = _req$body2.table, rawData = _req$body2.data;
          data = JSON.parse(rawData);

          if (!(!id || !table)) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Id and table are required'
          }));

        case 5:
          _context4.prev = 5;
          _context4.next = 8;
          return regeneratorRuntime.awrap(query('SELECT * FROM ?? WHERE id = ?', [table, id]));

        case 8:
          existingRows = _context4.sent;

          if (!(existingRows.length === 0)) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 11:
          // Handling file upload and deletion
          oldFilePath = existingRows[0].document;
          newFilePath = oldFilePath;

          if (!req.file) {
            _context4.next = 24;
            break;
          }

          newFilePath = req.file.path;

          if (!(oldFilePath && oldFilePath !== newFilePath)) {
            _context4.next = 24;
            break;
          }

          _context4.prev = 16;
          _context4.next = 19;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(oldFilePath)));

        case 19:
          _context4.next = 24;
          break;

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](16);
          console.error('Error deleting old file:', _context4.t0);

        case 24:
          if (newFilePath) {
            data.document = newFilePath;
          } // Construct the SET clause dynamically with proper escaping


          setClause = Object.keys(data).map(function (key) {
            return "`".concat(key, "` = ?");
          }).join(', ');
          values = Object.values(data); // Log the query for debugging purposes

          updateQuery = "UPDATE `".concat(table, "` SET ").concat(setClause, " WHERE id = ?");
          console.log('SQL Query:', updateQuery);
          console.log('Values:', [].concat(_toConsumableArray(values), [id]));
          _context4.next = 32;
          return regeneratorRuntime.awrap(query(updateQuery, [].concat(_toConsumableArray(values), [id])));

        case 32:
          res.json({
            message: 'Record updated successfully'
          });
          _context4.next = 39;
          break;

        case 35:
          _context4.prev = 35;
          _context4.t1 = _context4["catch"](5);
          console.error('Error updating record:', _context4.t1);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context4.t1.code)
          });

        case 39:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[5, 35], [16, 21]]);
});
router["delete"]('/deleterecord', function _callee4(req, res) {
  var _req$body3, id, table;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body3 = req.body, id = _req$body3.id, table = _req$body3.table;

          if (!(!table || !id)) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          console.log("Deleting from ".concat(table, " where id=").concat(id));
          _context5.prev = 4;
          _context5.next = 7;
          return regeneratorRuntime.awrap(query('DELETE FROM ?? WHERE id = ?', [table, id]));

        case 7:
          res.json({
            message: 'Item deleted successfully'
          });
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](4);
          console.error('Error deleting item:', _context5.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
router.post('/locktable', function _callee5(req, res) {
  var _req$body4, id, lock;

  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body4 = req.body, id = _req$body4.id, lock = _req$body4.lock;

          if (!(!id || lock === undefined)) {
            _context6.next = 3;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'ID and lock status are required'
          }));

        case 3:
          _context6.prev = 3;
          _context6.next = 6;
          return regeneratorRuntime.awrap(query('UPDATE form_locks SET is_locked = ? WHERE id = ?', [lock, id]));

        case 6:
          res.json({
            message: 'Item lock status updated successfully'
          });
          _context6.next = 13;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](3);
          console.error('Error updating lock status:', _context6.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          });

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
router.post('/getlocktablestatus', function _callee6(req, res) {
  var _req$body5, id, table, results;

  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body5 = req.body, id = _req$body5.id, table = _req$body5.table;

          if (!(!table || !id)) {
            _context7.next = 3;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(query('SELECT is_locked FROM ?? WHERE id=?', [table, id]));

        case 6:
          results = _context7.sent;

          if (results.length > 0) {
            res.status(200).json(results[0]);
          } else {
            res.status(404).json({
              error: 'Record not found'
            });
          }

          _context7.next = 14;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](3);
          console.error('Failed to fetch lock status:', _context7.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          });

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 10]]);
});
module.exports = router;