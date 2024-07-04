const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/gettable', async (req, res) => {
  console.log("Received request:", req.body);
  const { table, dept } = req.body;

  if (!table || !dept) {
    return res.status(400).send("Please provide both table and dept parameters.");
  }

  const query = 'SELECT * FROM ?? WHERE dept = ?';
  const values = [table, dept];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error and is in debug');
    }
    if (results.length === 0) {
      return res.status(404).send('No records found');
    }
    res.status(200).json(results);
  });
});

router.delete('/deleterecord', (req, res) => {
  const { id,table } = req.body; // Get table and id from request body
  if (!table || !id) {
    return res.status(400).json({ error: 'Table name and ID are required' });
  }
  console.log(`Deleting from ${table} where id=${id}`);
  db.query('DELETE FROM ?? WHERE id = ?', [table, id], (err, result) => {
    if (err) {
      console.error('Error deleting item:', err.stack);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

module.exports = router;
