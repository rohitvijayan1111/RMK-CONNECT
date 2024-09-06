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
  var table, department, recordSql, columnSql, recordValues, columnValues, columnResults, columnDataTypes, recordResults;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //console.log("Received request:", req.body);
          table = req.body.table;
          department = req.body.department;

          if (!(!table || !department)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).send("Please provide both table and department parameters."));

        case 4:
          recordSql = 'SELECT * FROM ?? ';
          columnSql = 'SHOW COLUMNS FROM ??';
          recordValues = [table];
          columnValues = [table];

          if (department !== "All") {
            recordSql += 'WHERE department = ? ';
            recordValues.push(department);
          }

          recordSql += 'ORDER BY department';
          _context.prev = 10;
          _context.next = 13;
          return regeneratorRuntime.awrap(query(columnSql, columnValues));

        case 13:
          columnResults = _context.sent;
          columnDataTypes = columnResults.reduce(function (acc, col) {
            acc[col.Field] = col.Type;
            return acc;
          }, {}); // Fetch table records

          _context.next = 17;
          return regeneratorRuntime.awrap(query(recordSql, recordValues));

        case 17:
          recordResults = _context.sent;

          if (!(recordResults.length === 0)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: []
          }));

        case 20:
          res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: recordResults
          });
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](10);
          console.error('Error fetching data:', _context.t0.message);
          return _context.abrupt("return", res.status(500).json({
            error: getFriendlyErrorMessage(_context.t0.code)
          }));

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[10, 23]]);
});
router.post('/create-table', function _callee2(req, res) {
  var _req$body, formName, attributes, tableName, columns, createTableQuery, insertLockQuery;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, formName = _req$body.formName, attributes = _req$body.attributes;

          if (!(!formName || !attributes || !Array.isArray(attributes))) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).send('Invalid request data'));

        case 3:
          // Construct table name and columns
          tableName = formName.replace(/\s+/g, '_').toLowerCase(); // Convert form name to a valid table name

          columns = 'id INT AUTO_INCREMENT PRIMARY KEY, ';
          attributes.forEach(function (attr) {
            var type = attr.type === 'text' ? 'VARCHAR(255)' : attr.type === 'number' ? 'INT' : attr.type === 'date' ? 'DATE' : attr.type === 'boolean' ? 'BOOLEAN' : attr.type === 'file' ? 'VARCHAR(255)' : // File type, storing file name or path
            attr.type === 'link' ? 'VARCHAR(255)' : 'TEXT'; // Link type, storing URL or related link

            columns += "".concat(attr.name.replace(/\s+/g, '_').toLowerCase(), " ").concat(type, ", ");
          }); // Remove trailing comma and space

          columns = columns.slice(0, -2);
          createTableQuery = "CREATE TABLE ".concat(tableName, " (").concat(columns, ")");
          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(query(createTableQuery));

        case 11:
          // Insert a record into the form_locks table
          insertLockQuery = "INSERT INTO form_locks (form_table_name, form_title, is_locked) VALUES (?, ?, ?)";
          _context2.next = 14;
          return regeneratorRuntime.awrap(query(insertLockQuery, [tableName, formName, 0]));

        case 14:
          // Initially, set is_locked to 0 (unlocked)
          res.send("Table ".concat(tableName, " created successfully"));
          _context2.next = 21;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](8);
          console.error('Error:', _context2.t0.message);
          res.status(500).send('Error creating table and inserting record');

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 17]]);
});
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    var table, dir;
    return regeneratorRuntime.async(function destination$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            table = req.body.table;
            dir = "./uploads/".concat(table);
            _context3.next = 4;
            return regeneratorRuntime.awrap(fsPromises.mkdir(dir, {
              recursive: true
            }));

          case 4:
            cb(null, dir);

          case 5:
          case "end":
            return _context3.stop();
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
router.post('/insertrecord', upload.single('file'), function _callee3(req, res) {
  var _req$body2, table, data, filePath, friendlyMessage;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, table = _req$body2.table, data = _objectWithoutProperties(_req$body2, ["table"]);

          if (!(!table || !data)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Data and table are required'
          }));

        case 3:
          _context4.prev = 3;
          filePath = null;

          if (req.file) {
            filePath = req.file.path;
            data.document = filePath;
          }

          _context4.next = 8;
          return regeneratorRuntime.awrap(query('INSERT INTO ?? SET ?', [table, data]));

        case 8:
          res.json({
            message: 'Record inserted successfully'
          });
          _context4.next = 16;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](3);
          console.error('Error inserting record:', _context4.t0);
          friendlyMessage = getFriendlyErrorMessage(_context4.t0.code);
          res.status(500).json({
            error: "".concat(friendlyMessage)
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 11]]);
});
router.post('/updaterecord', upload.single('file'), function _callee4(req, res) {
  var _req$body3, id, table, rawData, deleteFile, data, existingRows, oldFilePath, newFilePath, currentTimestamp, setClause, values, updateQuery;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log(req.body);
          _req$body3 = req.body, id = _req$body3.id, table = _req$body3.table, rawData = _req$body3.data, deleteFile = _req$body3.deleteFile;
          data = JSON.parse(rawData);

          if (!(!id || !table)) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Id and table are required'
          }));

        case 5:
          _context5.prev = 5;
          _context5.next = 8;
          return regeneratorRuntime.awrap(query('SELECT * FROM ?? WHERE id = ?', [table, id]));

        case 8:
          existingRows = _context5.sent;

          if (!(existingRows.length === 0)) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 11:
          // Handling file upload and deletion
          oldFilePath = existingRows[0].document;
          newFilePath = oldFilePath;

          if (!req.file) {
            _context5.next = 26;
            break;
          }

          newFilePath = req.file.path;

          if (!(oldFilePath && oldFilePath !== newFilePath)) {
            _context5.next = 24;
            break;
          }

          _context5.prev = 16;
          _context5.next = 19;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(oldFilePath)));

        case 19:
          _context5.next = 24;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](16);
          console.error('Error deleting old file:', _context5.t0);

        case 24:
          _context5.next = 36;
          break;

        case 26:
          if (!(deleteFile === 'true' && oldFilePath)) {
            _context5.next = 36;
            break;
          }

          _context5.prev = 27;
          _context5.next = 30;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(oldFilePath)));

        case 30:
          newFilePath = ''; // Clear the document path in the database

          _context5.next = 36;
          break;

        case 33:
          _context5.prev = 33;
          _context5.t1 = _context5["catch"](27);
          console.error('Error deleting old file:', _context5.t1);

        case 36:
          if (newFilePath) {
            data.document = newFilePath;
          } // Add current timestamp for createdAt/updatedAt


          currentTimestamp = new Date();
          data.createdAt = currentTimestamp; // Construct the SET clause dynamically with proper escaping

          setClause = Object.keys(data).map(function (key) {
            return "`".concat(key, "` = ?");
          }).join(', ');
          values = Object.values(data);
          updateQuery = "UPDATE `".concat(table, "` SET ").concat(setClause, ", createdAt = NOW() WHERE id = ?"); // NOW() adds the current timestamp

          console.log('SQL Query:', updateQuery);
          console.log('Values:', [].concat(_toConsumableArray(values), [id]));
          _context5.next = 46;
          return regeneratorRuntime.awrap(query(updateQuery, [].concat(_toConsumableArray(values), [id])));

        case 46:
          res.json({
            message: 'Record updated successfully'
          });
          _context5.next = 53;
          break;

        case 49:
          _context5.prev = 49;
          _context5.t2 = _context5["catch"](5);
          console.error('Error updating record:', _context5.t2);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context5.t2.code)
          });

        case 53:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 49], [16, 21], [27, 33]]);
});
router["delete"]('/deleterecord', function _callee5(req, res) {
  var _req$body4, id, table, record, filePath;

  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body4 = req.body, id = _req$body4.id, table = _req$body4.table;

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
          return regeneratorRuntime.awrap(query('SELECT document FROM ?? WHERE id = ?', [table, id]));

        case 6:
          record = _context6.sent;

          if (!(record.length === 0)) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 9:
          filePath = record[0].document;
          console.log(filePath);

          if (!filePath) {
            _context6.next = 21;
            break;
          }

          _context6.prev = 12;
          _context6.next = 15;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(filePath)));

        case 15:
          console.log("File at ".concat(filePath, " deleted successfully"));
          _context6.next = 21;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](12);
          console.error('Error deleting file:', _context6.t0); // Optionally, return an error or continue with the record deletion

        case 21:
          _context6.next = 23;
          return regeneratorRuntime.awrap(query('DELETE FROM ?? WHERE id = ?', [table, id]));

        case 23:
          res.json({
            message: 'Item and associated file (if any) deleted successfully'
          });
          _context6.next = 30;
          break;

        case 26:
          _context6.prev = 26;
          _context6.t1 = _context6["catch"](3);
          console.error('Error deleting item:', _context6.t1.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context6.t1.code)
          });

        case 30:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 26], [12, 18]]);
});
router.post('/locktable', function _callee6(req, res) {
  var _req$body5, id, lock;

  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body5 = req.body, id = _req$body5.id, lock = _req$body5.lock;

          if (!(!id || lock === undefined)) {
            _context7.next = 3;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'ID and lock status are required'
          }));

        case 3:
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(query('UPDATE form_locks SET is_locked = ? WHERE id = ?', [lock, id]));

        case 6:
          res.json({
            message: 'Item lock status updated successfully'
          });
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](3);
          console.error('Error updating lock status:', _context7.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
router.post('/getlocktablestatus', function _callee7(req, res) {
  var _req$body6, id, table, results;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body6 = req.body, id = _req$body6.id, table = _req$body6.table;

          if (!(!table || !id)) {
            _context8.next = 3;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context8.prev = 3;
          _context8.next = 6;
          return regeneratorRuntime.awrap(query('SELECT is_locked FROM ?? WHERE id=?', [table, id]));

        case 6:
          results = _context8.sent;

          if (results.length > 0) {
            res.status(200).json(results[0]);
          } else {
            res.status(404).json({
              error: 'Record not found'
            });
          }

          _context8.next = 14;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](3);
          console.error('Failed to fetch lock status:', _context8.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          });

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 10]]);
});
module.exports = router;