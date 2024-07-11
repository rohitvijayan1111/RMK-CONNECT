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

var query = util.promisify(db.query).bind(db);
router.post('/addabsent', function _callee(req, res) {
  var data, existingRecord, studentDetails, year, updateField, updateQuery, _updateQuery, insertQuery;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = req.body;
          console.log('Received data:', data);

          if (data) {
            _context.next = 5;
            break;
          }

          console.error('Data is required');
          return _context.abrupt("return", res.status(400).json({
            error: 'Data is required'
          }));

        case 5:
          _context.prev = 5;

          if (!data.student_id) {
            _context.next = 32;
            break;
          }

          console.log('Processing student_id:', data.student_id);
          _context.next = 10;
          return regeneratorRuntime.awrap(query('SELECT year FROM students WHERE id = ?', [data.student_id]));

        case 10:
          studentDetails = _context.sent;
          console.log('Query executed for student_id:', data.student_id);
          console.log('Student details:', studentDetails);

          if (!(!studentDetails || studentDetails.length === 0)) {
            _context.next = 16;
            break;
          }

          console.error('Student not found or missing year information');
          return _context.abrupt("return", res.status(404).json({
            error: 'Student not found or missing year information'
          }));

        case 16:
          year = studentDetails[0].year;
          console.log('Year:', year);

          if (year) {
            _context.next = 21;
            break;
          }

          console.error('Year information missing for the student');
          return _context.abrupt("return", res.status(404).json({
            error: 'Year information missing for the student'
          }));

        case 21:
          updateField = "todayabsentcount_year_".concat(year);
          console.log('Update field:', updateField);
          updateQuery = "\n                UPDATE MemberCount \n                SET ".concat(updateField, " = ").concat(updateField, " + 1 \n                WHERE department_name = ?");
          console.log('Executing query:', updateQuery);
          _context.next = 27;
          return regeneratorRuntime.awrap(query(updateQuery, [data.department_name]));

        case 27:
          _context.next = 29;
          return regeneratorRuntime.awrap(query('SELECT * FROM absent_attendance_records WHERE student_id = ? AND attendance_date = ?', [data.student_id, data.attendance_date]));

        case 29:
          existingRecord = _context.sent;
          _context.next = 45;
          break;

        case 32:
          if (!data.staff_id) {
            _context.next = 43;
            break;
          }

          console.log('Processing staff_id:', data.staff_id);
          _updateQuery = "\n                UPDATE MemberCount \n                SET todayabsentcount_staff = todayabsentcount_staff + 1 \n                WHERE department_name = ?";
          console.log('Executing query:', _updateQuery);
          _context.next = 38;
          return regeneratorRuntime.awrap(query(_updateQuery, [data.department_name]));

        case 38:
          _context.next = 40;
          return regeneratorRuntime.awrap(query('SELECT * FROM absent_attendance_records WHERE staff_id = ? AND attendance_date = ?', [data.staff_id, data.attendance_date]));

        case 40:
          existingRecord = _context.sent;
          _context.next = 45;
          break;

        case 43:
          console.error('Invalid data format');
          return _context.abrupt("return", res.status(400).json({
            error: 'Invalid data format'
          }));

        case 45:
          if (!(existingRecord && existingRecord.length > 0)) {
            _context.next = 48;
            break;
          }

          console.log('Record already exists:', existingRecord);
          return _context.abrupt("return", res.status(400).json({
            error: 'Record already exists for this date and user'
          }));

        case 48:
          console.log('Data to insert:', data);
          insertQuery = 'INSERT INTO absent_attendance_records SET ?';
          console.log('Executing insert query:', insertQuery, data);
          _context.next = 53;
          return regeneratorRuntime.awrap(query(insertQuery, data));

        case 53:
          res.json({
            message: 'Record inserted successfully'
          });
          _context.next = 60;
          break;

        case 56:
          _context.prev = 56;
          _context.t0 = _context["catch"](5);
          console.error('Error inserting record:', _context.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 60:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 56]]);
});

function getStudentYear(student_id) {
  var result;
  return regeneratorRuntime.async(function getStudentYear$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(query('SELECT year FROM students WHERE id = ?', [student_id]));

        case 2:
          result = _context2.sent;
          return _context2.abrupt("return", result.length > 0 ? result[0].year : null);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}

router.post('/removeabsent', function _callee2(req, res) {
  var _req$body, date, rollnumber, userGroup, department_name, column, checkQuery, records, studentYear, updateField, decrementQuery, result, _decrementQuery, _result, deleteResult;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, date = _req$body.date, rollnumber = _req$body.rollnumber, userGroup = _req$body.userGroup, department_name = _req$body.department_name;

          if (!(!date || !rollnumber || !userGroup || !department_name)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Date, Roll Number, User Group, and Department Name are required'
          }));

        case 3:
          console.log(userGroup);
          column = userGroup === 'Student' ? 'student_id' : 'staff_id';
          _context3.prev = 5;
          // Check if the attendance record exists
          checkQuery = "SELECT * FROM absent_attendance_records WHERE attendance_date=? AND ".concat(column, "=?");
          _context3.next = 9;
          return regeneratorRuntime.awrap(query(checkQuery, [date, rollnumber]));

        case 9:
          records = _context3.sent;

          if (!(records.length === 0)) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Attendance record not found'
          }));

        case 12:
          if (!(userGroup === 'Student')) {
            _context3.next = 27;
            break;
          }

          _context3.next = 15;
          return regeneratorRuntime.awrap(getStudentYear(rollnumber));

        case 15:
          studentYear = _context3.sent;

          if (studentYear) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Student year not found'
          }));

        case 18:
          updateField = "todayabsentcount_year_".concat(studentYear);
          decrementQuery = "\n                UPDATE MemberCount \n                SET ".concat(updateField, " = ").concat(updateField, " - 1 \n                WHERE department_name = ?");
          console.log("Executing query: ".concat(decrementQuery, " with department_name: ").concat(department_name));
          _context3.next = 23;
          return regeneratorRuntime.awrap(query(decrementQuery, [department_name]));

        case 23:
          result = _context3.sent;
          console.log("Update result: ".concat(JSON.stringify(result)));
          _context3.next = 34;
          break;

        case 27:
          if (!(userGroup === 'Staff')) {
            _context3.next = 34;
            break;
          }

          _decrementQuery = "\n                UPDATE MemberCount \n                SET todayabsentcount_staff = todayabsentcount_staff - 1 \n                WHERE department_name = ?";
          console.log("Executing query: ".concat(_decrementQuery, " with department_name: ").concat(department_name));
          _context3.next = 32;
          return regeneratorRuntime.awrap(query(_decrementQuery, [department_name]));

        case 32:
          _result = _context3.sent;
          console.log("Update result: ".concat(JSON.stringify(_result)));

        case 34:
          _context3.next = 36;
          return regeneratorRuntime.awrap(query("DELETE FROM absent_attendance_records WHERE attendance_date=? AND ".concat(column, "=?"), [date, rollnumber]));

        case 36:
          deleteResult = _context3.sent;

          if (!(deleteResult.affectedRows === 0)) {
            _context3.next = 39;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Record not found'
          }));

        case 39:
          res.json({
            message: 'Record removed successfully'
          });
          _context3.next = 46;
          break;

        case 42:
          _context3.prev = 42;
          _context3.t0 = _context3["catch"](5);
          console.error('Error removing record:', _context3.t0);
          res.status(500).json({
            error: 'Error removing record'
          });

        case 46:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[5, 42]]);
});
router.post('/getindividual', function _callee3(req, res) {
  var _req$body2, rollnumber, userGroup, column, result;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, rollnumber = _req$body2.rollnumber, userGroup = _req$body2.userGroup;

          if (!(!rollnumber || !userGroup)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Roll Number and User Group are required'
          }));

        case 3:
          column = userGroup === 'Student' ? 'student_id' : 'staff_id';
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(query("SELECT * FROM absent_attendance_records WHERE ".concat(column, "=?"), [rollnumber]));

        case 7:
          result = _context4.sent;

          if (!(result.length == 0)) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: "Record does not Exist"
          }));

        case 10:
          res.json(result);
          _context4.next = 17;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](4);
          console.error('Error fetching data:', _context4.t0);
          res.status(500).json({
            error: 'Error fetching data'
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 13]]);
});
router.post('/fetchtoday', function _callee4(req, res) {
  var userGroup, currentDate, department, formattedDate, queryStr, params, results;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log('Received request body:', req.body);
          userGroup = req.body.selectedUserGroup;
          currentDate = new Date();
          department = req.body.department;
          formattedDate = currentDate.toISOString().slice(0, 10);

          if (!(!userGroup || !department)) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'User Group and Department are required'
          }));

        case 7:
          if (!(department === "All")) {
            _context5.next = 21;
            break;
          }

          if (!(userGroup === 'Student')) {
            _context5.next = 13;
            break;
          }

          queryStr = "\n                SELECT \n                    s.name AS name,\n                    s.academic_year AS academic_year,\n                    s.department AS dept,\n                    s.parent_mail AS parent_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM students s\n                INNER JOIN absent_attendance_records a ON s.id = a.student_id\n                WHERE a.attendance_date = ? AND s.department IS NOT NULL;\n            ";
          params = [formattedDate];
          _context5.next = 19;
          break;

        case 13:
          if (!(userGroup === 'Staff')) {
            _context5.next = 18;
            break;
          }

          queryStr = "\n                SELECT \n                    st.name AS name,\n                    st.department AS dept,\n                    st.email AS staff_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM staffs st\n                INNER JOIN absent_attendance_records a ON st.id = a.staff_id\n                WHERE a.attendance_date = ? AND st.department IS NOT NULL;\n            ";
          params = [formattedDate];
          _context5.next = 19;
          break;

        case 18:
          return _context5.abrupt("return", res.status(400).json({
            error: 'Invalid User Group'
          }));

        case 19:
          _context5.next = 32;
          break;

        case 21:
          if (!(userGroup === 'Student')) {
            _context5.next = 26;
            break;
          }

          queryStr = "\n                SELECT \n                    s.name AS name,\n                    s.academic_year AS academic_year,\n                    s.department AS dept,\n                    s.parent_mail AS parent_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM students s\n                INNER JOIN absent_attendance_records a ON s.id = a.student_id\n                WHERE a.attendance_date = ? AND s.department = ?;\n            ";
          params = [formattedDate, department];
          _context5.next = 32;
          break;

        case 26:
          if (!(userGroup === 'Staff')) {
            _context5.next = 31;
            break;
          }

          queryStr = "\n                SELECT \n                    st.name AS name,\n                    st.department AS dept,\n                    st.email AS staff_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM staffs st\n                INNER JOIN absent_attendance_records a ON st.id = a.staff_id\n                WHERE a.attendance_date = ? AND st.department = ?;\n            ";
          params = [formattedDate, department];
          _context5.next = 32;
          break;

        case 31:
          return _context5.abrupt("return", res.status(400).json({
            error: 'Invalid User Group'
          }));

        case 32:
          console.log('Executing query:', queryStr);
          console.log('With params:', params);
          _context5.prev = 34;
          _context5.next = 37;
          return regeneratorRuntime.awrap(query(queryStr, params));

        case 37:
          results = _context5.sent;

          if (!(!results || results.length === 0)) {
            _context5.next = 40;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'No Records Found'
          }));

        case 40:
          res.json({
            message: 'Records fetched successfully',
            data: results
          });
          _context5.next = 47;
          break;

        case 43:
          _context5.prev = 43;
          _context5.t0 = _context5["catch"](34);
          console.error('Error fetching records:', _context5.t0);
          res.status(500).json({
            error: 'Error fetching records'
          });

        case 47:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[34, 43]]);
});
router.post('/fetchdatedata', function _callee5(req, res) {
  var userGroup, currentDate, department, formattedDate, queryStr, params, results;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log('Received request body:', req.body);
          userGroup = req.body.selectedUserGroup;
          currentDate = req.body.date;
          console.log('Received request body:', req.body);
          department = req.body.department;
          formattedDate = currentDate;

          if (!(!userGroup || !department)) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'User Group and Department are required'
          }));

        case 8:
          if (!(department === "All")) {
            _context6.next = 22;
            break;
          }

          if (!(userGroup === 'Student')) {
            _context6.next = 14;
            break;
          }

          queryStr = "\n                SELECT \n                    s.name AS name,\n                    s.academic_year AS academic_year,\n                    s.department AS dept,\n                    s.parent_mail AS parent_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM students s\n                INNER JOIN absent_attendance_records a ON s.id = a.student_id\n                WHERE a.attendance_date = ? AND s.department IS NOT NULL;\n            ";
          params = [formattedDate];
          _context6.next = 20;
          break;

        case 14:
          if (!(userGroup === 'Staff')) {
            _context6.next = 19;
            break;
          }

          queryStr = "\n                SELECT \n                    st.name AS name,\n                    st.department AS dept,\n                    st.email AS staff_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM staffs st\n                INNER JOIN absent_attendance_records a ON st.id = a.staff_id\n                WHERE a.attendance_date = ? AND st.department IS NOT NULL;\n            ";
          params = [formattedDate];
          _context6.next = 20;
          break;

        case 19:
          return _context6.abrupt("return", res.status(400).json({
            error: 'Invalid User Group'
          }));

        case 20:
          _context6.next = 33;
          break;

        case 22:
          if (!(userGroup === 'Student')) {
            _context6.next = 27;
            break;
          }

          queryStr = "\n                SELECT \n                    s.name AS name,\n                    s.academic_year AS academic_year,\n                    s.department AS dept,\n                    s.parent_mail AS parent_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM students s\n                INNER JOIN absent_attendance_records a ON s.id = a.student_id\n                WHERE a.attendance_date = ? AND s.department = ?;\n            ";
          params = [formattedDate, department];
          _context6.next = 33;
          break;

        case 27:
          if (!(userGroup === 'Staff')) {
            _context6.next = 32;
            break;
          }

          queryStr = "\n                SELECT \n                    st.name AS name,\n                    st.department AS dept,\n                    st.email AS staff_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM staffs st\n                INNER JOIN absent_attendance_records a ON st.id = a.staff_id\n                WHERE a.attendance_date = ? AND st.department = ?;\n            ";
          params = [formattedDate, department];
          _context6.next = 33;
          break;

        case 32:
          return _context6.abrupt("return", res.status(400).json({
            error: 'Invalid User Group'
          }));

        case 33:
          console.log('Executing query:', queryStr);
          console.log('With params:', params);
          _context6.prev = 35;
          _context6.next = 38;
          return regeneratorRuntime.awrap(query(queryStr, params));

        case 38:
          results = _context6.sent;

          if (!(!results || results.length === 0)) {
            _context6.next = 41;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: 'No Records Found'
          }));

        case 41:
          res.json({
            message: 'Records fetched successfully',
            data: results
          });
          _context6.next = 48;
          break;

        case 44:
          _context6.prev = 44;
          _context6.t0 = _context6["catch"](35);
          console.error('Error fetching records:', _context6.t0);
          res.status(500).json({
            error: 'Error fetching records'
          });

        case 48:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[35, 44]]);
});
router.post('/attendance-summary', function _callee6(req, res) {
  var department, results, row, data;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          department = req.body.department;

          if (department) {
            _context7.next = 3;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Department is required'
          }));

        case 3:
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(query('SELECT * FROM membercount WHERE department_name = ?', [department]));

        case 6:
          results = _context7.sent;

          if (!(results.length === 0)) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            error: 'Department not found'
          }));

        case 9:
          row = results[0];
          data = [{
            name: "I YR",
            present: row.year_I_count - row.todayabsentcount_year_I,
            absent: row.todayabsentcount_year_I
          }, {
            name: "II YR",
            present: row.year_II_count - row.todayabsentcount_year_II,
            absent: row.todayabsentcount_year_II
          }, {
            name: "III YR",
            present: row.year_III_count - row.todayabsentcount_year_III,
            absent: row.todayabsentcount_year_III
          }, {
            name: "IV YR",
            present: row.year_IV_count - row.todayabsentcount_year_IV,
            absent: row.todayabsentcount_year_IV
          }, {
            name: 'Staff',
            present: row.staff_count - row.todayabsentcount_staff,
            absent: row.todayabsentcount_staff
          }];
          res.json(data);
          _context7.next = 18;
          break;

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](3);
          console.error('Error fetching attendance summary:', _context7.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 14]]);
});
router.post('/attendance-count-summary', function _callee7(req, res) {
  var department, results, row, total_student, absent_student, total_staff, absent_staff, data;
  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          department = req.body.department;

          if (department) {
            _context8.next = 3;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            error: 'Department is required'
          }));

        case 3:
          _context8.prev = 3;
          _context8.next = 6;
          return regeneratorRuntime.awrap(query('SELECT * FROM membercount WHERE department_name = ?', [department]));

        case 6:
          results = _context8.sent;

          if (!(results.length === 0)) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: 'Department not found'
          }));

        case 9:
          row = results[0];
          total_student = row.year_I_count + row.year_II_count + row.year_III_count + row.year_IV_count;
          absent_student = row.todayabsentcount_year_I + row.todayabsentcount_year_II + row.todayabsentcount_year_III + row.todayabsentcount_year_IV;
          total_staff = row.staff_count;
          absent_staff = row.todayabsentcount_staff;
          data = {
            Total_students: total_student,
            Student_Present: total_student - absent_student,
            Student_Absent: absent_student,
            Total_staff: total_staff,
            Staff_Present: total_staff - absent_staff,
            Staff_Absent: absent_staff
          };
          res.json(data);
          _context8.next = 22;
          break;

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](3);
          console.error('Error fetching attendance summary:', _context8.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 18]]);
});
router.post('/attendance-graph', function _callee8(req, res) {
  var _req$body3, user, department, column, results, currentDate, formattedDate, formattedResults;

  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body3 = req.body, user = _req$body3.user, department = _req$body3.department;
          console.log(req.body);

          if (!(!department || !user)) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            error: 'Department and user type are required'
          }));

        case 4:
          if (user === 'Student') {
            column = "student_id";
          } else {
            column = "staff_id";
          }

          _context9.prev = 5;
          _context9.next = 8;
          return regeneratorRuntime.awrap(query("SELECT attendance_date as date, count(*) as total FROM absent_attendance_records WHERE department_name = ? AND ".concat(column, " IS NOT NULL GROUP BY date LIMIT 7"), [department]));

        case 8:
          results = _context9.sent;
          console.log('Query results:', results);

          if (!(results.length === 0)) {
            _context9.next = 14;
            break;
          }

          currentDate = new Date();
          formattedDate = "".concat(currentDate.getDate(), "/").concat(currentDate.getMonth() + 1);
          return _context9.abrupt("return", res.json({
            name: formattedDate,
            absent: 0
          }));

        case 14:
          formattedResults = results.map(function (row) {
            var date = new Date(row.date);
            var formattedDate = "".concat(date.getDate(), "/").concat(date.getMonth() + 1);
            return {
              name: formattedDate,
              absent: row.total
            };
          });
          res.json(formattedResults);
          _context9.next = 22;
          break;

        case 18:
          _context9.prev = 18;
          _context9.t0 = _context9["catch"](5);
          console.error('Error fetching attendance summary:', _context9.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 22:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[5, 18]]);
});
router.post('/admin-attendance-summary', function _callee9(req, res) {
  var user, queryStr, presentField, absentField, results, data;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          user = req.body.user;

          if (user) {
            _context10.next = 3;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            error: 'User type is required'
          }));

        case 3:
          if (!(user.toLowerCase() === 'student')) {
            _context10.next = 9;
            break;
          }

          queryStr = "\n            SELECT \n                department_name, \n                (SUM(year_I_count) + SUM(year_II_count) + SUM(year_III_count) + SUM(year_IV_count)) AS total_students, \n                (SUM(todayabsentcount_year_I) + SUM(todayabsentcount_year_II) + SUM(todayabsentcount_year_III) + SUM(todayabsentcount_year_IV)) AS total_absent_students\n            FROM membercount \n            GROUP BY department_name\n        ";
          presentField = 'total_students';
          absentField = 'total_absent_students';
          _context10.next = 16;
          break;

        case 9:
          if (!(user.toLowerCase() === 'faculty')) {
            _context10.next = 15;
            break;
          }

          queryStr = "\n            SELECT \n                department_name, \n                SUM(staff_count) AS total_staff, \n                SUM(todayabsentcount_staff) AS total_absent_staff\n            FROM membercount \n            GROUP BY department_name\n        ";
          presentField = 'total_staff';
          absentField = 'total_absent_staff';
          _context10.next = 16;
          break;

        case 15:
          return _context10.abrupt("return", res.status(400).json({
            error: 'Invalid user type'
          }));

        case 16:
          _context10.prev = 16;
          _context10.next = 19;
          return regeneratorRuntime.awrap(query(queryStr));

        case 19:
          results = _context10.sent;

          if (!(results.length === 0)) {
            _context10.next = 22;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            error: 'No departments found'
          }));

        case 22:
          data = results.map(function (row) {
            return {
              name: row.department_name,
              present: row[presentField] - row[absentField],
              absent: row[absentField]
            };
          });
          res.json(data);
          _context10.next = 30;
          break;

        case 26:
          _context10.prev = 26;
          _context10.t0 = _context10["catch"](16);
          console.error('Error fetching attendance summary:', _context10.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 30:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[16, 26]]);
});
router.post('/admin-attendance-count-summary', function _callee10(req, res) {
  var results, total_student, absent_student, total_staff, absent_staff, data;
  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          console.log("INNN");
          _context11.next = 4;
          return regeneratorRuntime.awrap(query('SELECT * FROM membercount'));

        case 4:
          results = _context11.sent;

          if (!(results.length === 0)) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            error: 'No departments found'
          }));

        case 7:
          total_student = 0;
          absent_student = 0;
          total_staff = 0;
          absent_staff = 0;
          results.forEach(function (row) {
            total_student += row.year_I_count + row.year_II_count + row.year_III_count + row.year_IV_count;
            absent_student += row.todayabsentcount_year_I + row.todayabsentcount_year_II + row.todayabsentcount_year_III + row.todayabsentcount_year_IV;
            total_staff += row.staff_count;
            absent_staff += row.todayabsentcount_staff;
          });
          data = {
            Total_students: total_student,
            Student_Present: total_student - absent_student,
            Student_Absent: absent_student,
            Total_staff: total_staff,
            Staff_Present: total_staff - absent_staff,
            Staff_Absent: absent_staff
          };
          res.json(data);
          _context11.next = 20;
          break;

        case 16:
          _context11.prev = 16;
          _context11.t0 = _context11["catch"](0);
          console.error('Error fetching attendance summary:', _context11.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 20:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.post('/admin-attendance-graph', function _callee11(req, res) {
  var user, column, results, currentDate, formattedDate, formattedResults;
  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          user = req.body.user;
          console.log(req.body);

          if (user) {
            _context12.next = 4;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            error: 'User type is required'
          }));

        case 4:
          if (user === 'Student') {
            column = "student_id";
          } else {
            column = "staff_id";
          }

          _context12.prev = 5;
          _context12.next = 8;
          return regeneratorRuntime.awrap(query("SELECT attendance_date as date, count(*) as total FROM absent_attendance_records WHERE ".concat(column, " IS NOT NULL GROUP BY date LIMIT 7")));

        case 8:
          results = _context12.sent;
          console.log('Query results:', results);

          if (!(results.length === 0)) {
            _context12.next = 14;
            break;
          }

          currentDate = new Date();
          formattedDate = "".concat(currentDate.getDate(), "/").concat(currentDate.getMonth() + 1);
          return _context12.abrupt("return", res.json({
            name: formattedDate,
            absent: 0
          }));

        case 14:
          formattedResults = results.map(function (row) {
            var date = new Date(row.date);
            var formattedDate = "".concat(date.getDate(), "/").concat(date.getMonth() + 1);
            return {
              name: formattedDate,
              absent: row.total
            };
          });
          res.json(formattedResults);
          _context12.next = 22;
          break;

        case 18:
          _context12.prev = 18;
          _context12.t0 = _context12["catch"](5);
          console.error('Error fetching attendance summary:', _context12.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 22:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[5, 18]]);
});
module.exports = router;