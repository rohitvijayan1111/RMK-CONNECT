"use strict";

var express = require('express');

var router = express.Router();

var db = require('../config/db');

router.post('/academicyear', function (req, res) {
  var query = "SELECT DISTINCT academic_year FROM students";
  db.query(query, function (err, results) {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({
        error: 'Error fetching distinct values'
      });
      return;
    }

    var distinctValues = results.map(function (row) {
      return row.academic_year;
    });
    res.json(distinctValues);
  });
});
router.post('/studentsgraph', function (req, res) {
  var _req$body = req.body,
      dept = _req$body.dept,
      academic_year = _req$body.academic_year;
  var query = "\n    SELECT \n      SUM(IF(placements_status!= 'placed', 1, 0)) as placed_students,\n      SUM(IF(placements_status!= 'pending', 1, 0)) as yet_placed_students, \n      SUM(IF(higher_studies_status!= 'not applicable', 1, 0)) as higher_studies_students\n    FROM \n      students\n    WHERE \n      department =? and academic_year=?\n  ";
  db.query(query, [dept, academic_year], function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({
        message: 'Error executing query'
      });
      return;
    }

    res.json(results[0]);
  });
});
router.post('/staffgraph', function (req, res) {
  var dept = req.body.dept;
  var query = "\n    SELECT \n      SUM(CASE WHEN designation = 'PG Staff' THEN 1 ELSE 0 END) as PG_Staff,\n      SUM(CASE WHEN designation = 'Asst. Prof' THEN 1 ELSE 0 END) as Asst_Prof,\n      SUM(CASE WHEN designation = 'Pursuing PG' THEN 1 ELSE 0 END) as Pursuing_PG,\n      SUM(CASE WHEN designation = 'Non-Technical' THEN 1 ELSE 0 END) as Non_Technical\n    FROM \n      staffs\n    WHERE \n      department = ?;\n  ";
  db.query(query, [dept], function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({
        message: 'Error executing query'
      });
      return;
    }

    res.json(results[0]);
  });
});
router.post('/studentsyrsgraph', function (req, res) {
  var dept = req.body.dept;
  var query = "\n    SELECT \n      SUM(IF(year = 'I', 1, 0)) AS firstyear,\n      SUM(IF(year = 'II', 1, 0)) AS secondyear,\n      SUM(IF(year = 'III', 1, 0)) AS thirdyear,\n      SUM(IF(year = 'IV', 1, 0)) AS fourthyear\n    FROM \n      students\n    WHERE \n      department = ?;\n  ";
  db.query(query, [dept], function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({
        message: 'Error executing query'
      });
      return;
    }

    res.json(results[0]);
  });
});
module.exports = router;