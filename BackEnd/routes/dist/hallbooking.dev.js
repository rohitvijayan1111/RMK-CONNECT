"use strict";

var express = require('express');

var router = express.Router();

var db = require('../config/db');

var util = require('util');

var _require = require('console'),
    error = _require.error;

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

var query = util.promisify(db.query).bind(db); // Fetch all halls

router.get('/availablehalls', function _callee(req, res) {
  var sql, result, transformedHalls;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          sql = 'SELECT * FROM halls';
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(query(sql));

        case 4:
          result = _context.sent;
          transformedHalls = result.map(function (hall) {
            return {
              id: hall.id,
              name: hall.hall_name,
              image: hall.image_path,
              location: hall.hall_location,
              capacity: hall.capacity,
              facilities: hall.facilities.split(',')
            };
          });
          res.json(transformedHalls);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          console.error('Error fetching halls:', _context.t0);
          res.status(500).json({
            error: 'Failed to fetch halls'
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 9]]);
}); // Fetch hall names for dropdown

router.get('/halls', function _callee2(req, res) {
  var sql, results;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          sql = 'SELECT hall_name FROM halls';
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(query(sql));

        case 4:
          results = _context2.sent;
          res.json(results);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          console.error('Error fetching hall names:', _context2.t0);
          res.status(500).json({
            error: 'Failed to fetch hall names'
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
router.post('/hall-request', function _callee3(req, res) {
  var _req$body, name, speaker, speaker_description, event_date, start_time, end_time, hall_name, participants, incharge_faculty, facility_needed, checkQuery, results, insertRequestQuery;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, speaker = _req$body.speaker, speaker_description = _req$body.speaker_description, event_date = _req$body.event_date, start_time = _req$body.start_time, end_time = _req$body.end_time, hall_name = _req$body.hall_name, participants = _req$body.participants, incharge_faculty = _req$body.incharge_faculty, facility_needed = _req$body.facility_needed;
          checkQuery = "SELECT * FROM hall_allotment WHERE hall_name = ? AND event_date = ? AND (\n                        (start_time < ? AND end_time > ?) OR\n                        (start_time < ? AND end_time > ?) OR\n                        (start_time >= ? AND end_time <= ?))";
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(query(checkQuery, [hall_name, event_date, start_time, start_time, end_time, end_time, start_time, end_time]));

        case 5:
          results = _context3.sent;

          if (!(results.length > 0)) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Hall is not available for the requested time and date.'
          }));

        case 8:
          insertRequestQuery = "INSERT INTO hall_request (name, speaker, speaker_description, event_date, start_time, end_time, hall_name, participants, incharge_faculty, facility_needed)\n                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          _context3.next = 11;
          return regeneratorRuntime.awrap(query(insertRequestQuery, [name, speaker, speaker_description, event_date, start_time, end_time, hall_name, participants, incharge_faculty, facility_needed]));

        case 11:
          res.send('Hall request submitted');
          _context3.next = 18;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](2);
          console.error('Error processing hall request:', _context3.t0);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context3.t0)
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 14]]);
});
router.get('/hall_requests_status', function (req, res) {
  var query = 'SELECT * FROM hall_request';
  db.query(query, function (err, results) {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send({
        error: getFriendlyErrorMessage(err)
      });
      return;
    }

    if (results.length == 0) {
      return res.status(404).json({
        error: "No Records found"
      });
    }

    var formattedEvents = results.map(function (event) {
      return {
        name: event.name,
        speaker: event.speaker,
        speakerDescription: event.speaker_description,
        date: event.event_date,
        from: event.start_time,
        to: event.end_time,
        hallName: event.hall_name,
        participants: event.participants,
        inchargeFaculty: event.incharge_faculty,
        facilityNeeded: event.facility_needed,
        approvals: {
          hod: event.hod_approval === 1,
          vicePrincipal: event.vice_principal_approval === 1,
          principal: event.principal_approval === 1
        }
      };
    });
    res.json(formattedEvents);
  });
});
router.get('/past-events', function _callee4(req, res) {
  var sql, results, formattedEvents;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          sql = "\n      SELECT ha.*, hr.name, hr.speaker, hr.speaker_description, hr.participants, hr.incharge_faculty, hr.facility_needed, hr.hod_approval, hr.vice_principal_approval, hr.principal_approval\n      FROM hall_allotment ha\n      JOIN hall_request hr ON ha.request_id = hr.id\n      WHERE ha.event_date < CURDATE();\n    ";
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(query(sql));

        case 4:
          results = _context4.sent;

          if (!(results.length === 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "No records found"
          }));

        case 7:
          formattedEvents = results.map(function (event) {
            return {
              name: event.name,
              speaker: event.speaker,
              speakerDescription: event.speaker_description,
              date: event.event_date,
              from: event.start_time,
              to: event.end_time,
              hallName: event.hall_name,
              participants: event.participants,
              inchargeFaculty: event.incharge_faculty,
              facilityNeeded: event.facility_needed,
              approvals: {
                hod: event.hod_approval === 1,
                vicePrincipal: event.vice_principal_approval === 1,
                principal: event.principal_approval === 1
              }
            };
          });
          res.json(formattedEvents);
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](1);
          console.error('Error fetching past events:', _context4.t0);
          res.status(500).json({
            error: 'Server error occurred'
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 11]]);
});
router.get('/upcoming-events', function _callee5(req, res) {
  var sql, results, formattedEvents;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          sql = "\n      SELECT ha.*, hr.name, hr.speaker, hr.speaker_description, hr.participants, hr.incharge_faculty, hr.facility_needed, hr.hod_approval, hr.vice_principal_approval, hr.principal_approval\n      FROM hall_allotment ha\n      JOIN hall_request hr ON ha.request_id = hr.id\n      WHERE ha.event_date >= CURDATE();\n    ";
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(query(sql));

        case 4:
          results = _context5.sent;

          if (!(results.length === 0)) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "No upcoming events found"
          }));

        case 7:
          formattedEvents = results.map(function (event) {
            return {
              name: event.name,
              speaker: event.speaker,
              speakerDescription: event.speaker_description,
              date: event.event_date,
              from: event.start_time,
              to: event.end_time,
              hallName: event.hall_name,
              participants: event.participants,
              inchargeFaculty: event.incharge_faculty,
              facilityNeeded: event.facility_needed,
              approvals: {
                hod: event.hod_approval === 1,
                vicePrincipal: event.vice_principal_approval === 1,
                principal: event.principal_approval === 1
              }
            };
          });
          res.json(formattedEvents);
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](1);
          console.error('Error fetching upcoming events:', _context5.t0);
          res.status(500).json({
            error: 'Server error occurred'
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 11]]);
});
module.exports = router;