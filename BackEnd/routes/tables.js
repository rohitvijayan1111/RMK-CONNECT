const express = require('express');
const router = express.Router();
const db = require('../config/db');
const util = require('util');
const moment = require('moment');
const path = require('path'); 
const multer = require('multer');
const fs = require('fs');
const query = util.promisify(db.query).bind(db);
const fsPromises = require('fs').promises; // For async operations

const getFriendlyErrorMessage = (errCode) => {
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

router.post('/gettable', async (req, res) => {
  console.log("Received request:", req.body);
  const table = req.body.table;
  const department = req.body.department; 

  if (!table || !department) {
    return res.status(400).send("Please provide both table and department parameters.");
  }
  let recordSql = 'SELECT * FROM ?? ';
  if(department!=="All")
  {
    recordSql+='WHERE department = ?';
  }
  recordSql+='ORDER BY department'     
  const columnSql = 'SHOW COLUMNS FROM ??';
  
  const columnValues = [table];
  const recordValues = [table, department];

  try {
    const columnResults = await query(columnSql, columnValues);
    const columnNames = columnResults.map(col => col.Field);

    const recordResults = await query(recordSql, recordValues);
    
    if (recordResults.length === 0) {
      return res.status(200).json({ columnNames, data: [] });
    }

    res.status(200).json({ columnNames, data: recordResults });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
  }
});
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const table = req.body.table;
    const dir = `./uploads/${table}`;
    await fsPromises.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = `${moment().format('YYYYMMDD_HHmmss')}_${file.originalname}`;
    cb(null, fileName); 
  }
});

const upload = multer({ storage: storage });

router.post('/insertrecord', upload.single('file'), async (req, res) => {
  const { table, ...data } = req.body;

  if (!table || !data) {
    return res.status(400).json({ error: 'Data and table are required' });
  }

  try {
    let filePath = null;
    if (req.file) {
      filePath = req.file.path;
      data.document = filePath;
    }

    await query('INSERT INTO ?? SET ?', [table, data]);

    res.json({ message: 'Record inserted successfully' });
  } catch (error) {
    console.error('Error inserting record:', error);
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    res.status(500).json({ error: `${friendlyMessage}` });
  }
});
router.post('/updaterecord', upload.single('file'), async (req, res) => {
  console.log(req.body);
  const { id, table, data: rawData } = req.body;
  const data = JSON.parse(rawData);

  if (!id || !table) {
    return res.status(400).json({ error: 'Id and table are required' });
  }

  try {
    const existingRows = await query('SELECT * FROM ?? WHERE id = ?', [table, id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Handling file upload and deletion
    const oldFilePath = existingRows[0].document;
    let newFilePath = oldFilePath;

    if (req.file) {
      newFilePath = req.file.path;
      if (oldFilePath && oldFilePath !== newFilePath) {
        try {
          await fsPromises.unlink(path.resolve(oldFilePath));
        } catch (unlinkError) {
          console.error('Error deleting old file:', unlinkError);
        }
      }
    }

    if (newFilePath) {
      data.document = newFilePath;
    }

    // Construct the SET clause dynamically with proper escaping
    const setClause = Object.keys(data).map(key => `\`${key}\` = ?`).join(', ');
    const values = Object.values(data);

    // Log the query for debugging purposes
    const updateQuery = `UPDATE \`${table}\` SET ${setClause} WHERE id = ?`;
    console.log('SQL Query:', updateQuery);
    console.log('Values:', [...values, id]);

    await query(updateQuery, [...values, id]);

    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
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
    res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
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
    res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
  }
});


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
    res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
  }
});

module.exports = router;