const express = require('express');
const router = express.Router();
const db = require('../config/db');
const util = require('util');
const moment = require('moment');


const query = util.promisify(db.query).bind(db);

router.post('/gettable', async (req, res) => {
  console.log("Received request:", req.body);
  const { table, dept } = req.body;

  if (!table || !dept) {
    return res.status(400).send("Please provide both table and dept parameters.");
  }

  const sql = 'SELECT * FROM ?? WHERE dept = ?';
  const values = [table, dept];

  try {
    const results = await query(sql, values);
    if (results.length === 0) {
      return res.status(404).send('No records found');
    }
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error and is in debug');
  }
});

router.put('/updaterecord', async (req, res) => {
  const { id, data, table } = req.body;

  if (!id || !data || !table) {
    return res.status(400).json({ error: 'Id, data, and table are required' });
  }

  try {
    
    const existingRows = await query('SELECT * FROM ?? WHERE id = ?', [table, id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    if (data.createdAt) {
      data.createdAt = moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss');
    }
    if (data.deadline) {
      data.deadline = moment(data.deadline).format('YYYY-MM-DD HH:mm:ss');
    }
    
    await query('UPDATE ?? SET ? WHERE id = ?', [table, data, id]);

    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/insertrecord', async (req, res) => {
  const { data, table } = req.body;

  if (!data || !table) {
    return res.status(400).json({ error: 'Data and table are required' });
  }

  try {
    await query('INSERT INTO ?? SET ?', [table, data]);

    res.json({ message: 'Record inserted successfully' });
  } catch (error) {
    console.error('Error inserting record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/deleterecord', async (req, res) => {
  const { id, table } = req.body;

  if (!table || !id) {
    return res.status(400).json({ error: 'Table name and ID are required' });
  }

  console.log(`Deleting from ${table} where id=${id}`);
  try {
    await query('DELETE FROM ?? WHERE id = ?', [table, id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
});
router.post('/locktable', async (req, res) => {
  const { id, lock } = req.body;

  if (!id || lock === undefined) {
    return res.status(400).json({ error: 'ID and lock status are required' });
  }

  try {
    await query('UPDATE form_locks SET is_locked = ? WHERE id = ?', [lock, id]);
    res.json({ message: 'Item lock status updated successfully' });
  } catch (err) {
    console.error('Error updating lock status:', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint to get lock status of a record
router.post('/getlocktablestatus', async (req, res) => {
  const { id, table } = req.body;

  if (!table || !id) {
    return res.status(400).json({ error: 'Table name and ID are required' });
  }

  try {
    const results = await query('SELECT is_locked FROM ?? WHERE id=?', [table, id]);
    if (results.length > 0) {
      res.status(200).json(results[0]); 
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (err) {
    console.error('Failed to fetch lock status:', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
});
module.exports = router;
