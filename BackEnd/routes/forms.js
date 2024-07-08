const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cors = require('cors');

// Allow requests from all origins
router.use(cors());

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

router.post('/getEndIndex', async (req, res) => {
    console.log("Received request:", req.body);

    const sql = 'SELECT * FROM FormEndIndex;';
    try {
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
            }
            if (results.length === 0) {
                return res.status(404).send('End index not found');
            }
            console.log('Database results:', results);
            res.status(200).json(results[0]);
        });
    } catch (err) {
        console.error('Catch error:', err.message);
        return res.status(500).send(getFriendlyErrorMessage(err.code));
    }
});

router.post('/createformrecord', async (req, res) => {
    const { form_name,possible_start_index, Max_index, attributes } = req.body;
    console.log('Received payload:', req.body);

    if (!form_name || !possible_start_index ||!Max_index || !attributes) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let parsedAttributes;
    try {
        parsedAttributes = JSON.parse(attributes);
        if (!Array.isArray(parsedAttributes)) {
            throw new Error('Attributes should be an array');
        }
    } catch (err) {
        return res.status(400).json({ error: 'Invalid attributes format' });
    }

    const sql = 'INSERT INTO Forms (form_name,possible_start_index, Max_index, attributes) VALUES (?, ?, ?, ?)';
    const values = [form_name,possible_start_index, Max_index, attributes];

    try {
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
            }
            res.status(201).send('Form created successfully');
        });
    } catch (err) {
        console.error('Catch error:', err.message);
        res.status(500).send(getFriendlyErrorMessage(err.code));
    }
});

router.post('/getformlist', async (req, res) => {
  console.log("Received request:", req.body);

  const sql = 'SELECT * FROM forms;';
  try {
      db.query(sql, (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
          }
          if (results.length === 0) {
              return res.status(404).send('End index not found');
          }
          console.log('Database results:', results);
          res.status(200).json(results);
      });
  } catch (err) {
      console.error('Catch error:', err.message);
      return res.status(500).send(getFriendlyErrorMessage(err.code));
  }
});

module.exports = router;
