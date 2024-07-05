const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/academicyear', (req, res) => {
  const query = `SELECT DISTINCT academic_year FROM students`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ error: 'Error fetching distinct values' });
      return;
    }

    const distinctValues = results.map(row => row.academic_year);

    res.json(distinctValues);
  });
});


router.post('/studentsgraph', (req, res) => {
  const { dept, academic_year } = req.body;
  const query = `
    SELECT 
      SUM(IF(placements_status!= 'placed', 1, 0)) as placed_students,
      SUM(IF(placements_status!= 'pending', 1, 0)) as yet_placed_students, 
      SUM(IF(higher_studies_status!= 'not applicable', 1, 0)) as higher_studies_students
    FROM 
      students
    WHERE 
      department =? and academic_year=?
  `;

  db.query(query, [dept, academic_year], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Error executing query' });
      return;
    }

    res.json(results[0]);
  });
});

router.post('/staffgraph', (req, res) => {
  const {dept} = req.body;
  const query = `
    SELECT 
      SUM(CASE WHEN designation = 'PG Staff' THEN 1 ELSE 0 END) as PG_Staff,
      SUM(CASE WHEN designation = 'Asst. Prof' THEN 1 ELSE 0 END) as Asst_Prof,
      SUM(CASE WHEN designation = 'Pursuing PG' THEN 1 ELSE 0 END) as Pursuing_PG,
      SUM(CASE WHEN designation = 'Non-Technical' THEN 1 ELSE 0 END) as Non_Technical
    FROM 
      staffs
    WHERE 
      department = ?;
  `;

  db.query(query, [dept], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Error executing query' });
      return;
    }

    res.json(results[0]);
  });
});

router.post('/studentsyrsgraph', (req, res) => {
  const { dept } = req.body;
  const query = `
    SELECT 
      SUM(IF(year = 'I', 1, 0)) AS firstyear,
      SUM(IF(year = 'II', 1, 0)) AS secondyear,
      SUM(IF(year = 'III', 1, 0)) AS thirdyear,
      SUM(IF(year = 'IV', 1, 0)) AS fourthyear
    FROM 
      students
    WHERE 
      department = ?;
  `;

  db.query(query, [dept], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Error executing query' });
      return;
    }

    res.json(results[0]);
  });
});

module.exports = router;
