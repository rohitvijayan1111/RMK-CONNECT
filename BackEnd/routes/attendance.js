    const express = require('express');
    const router = express.Router();
    const db = require('../config/db');
    const util = require('util');
    const moment = require('moment');
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
    router.post('/addabsent', async (req, res) => {
        const data = req.body;
    
        if (!data ) {
        return res.status(400).json({ error: 'Data is required' });
        }
        try {
        await db.query('INSERT INTO absent_attendance_records SET ?', [data]);
        res.json({ message: 'Record inserted successfully' });
        } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.post('/removeabsent', async (req, res) => {
        const { date, rollnumber, userGroup } = req.body;
        if (!date || !rollnumber || !userGroup) {
            return res.status(400).json({ error: 'Date, Roll Number, and User Group are required' });
        }
        console.log(userGroup);
        const column = userGroup === 'Student' ? 'student_id' : 'staff_id';
    
        const query = `DELETE FROM absent_attendance_records WHERE attendance_date=? AND ${column}=?`;
        db.query(query, [date, rollnumber], (error, result) => {
            if (error) {
                console.error('Error removing record:', error);
                return res.status(500).json({ error: 'Error removing record' });
            }
    
            console.log(result); 
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Record not found' });
            }
    
            res.json({ message: 'Record removed successfully' });
        });
    });
    router.post('/fetchtoday', async (req, res) => {
        const { date,userGroup } = req.body;
        if (!date || !userGroup) {
            return res.status(400).json({ error: 'Date and User Group are required' });
        }
        const column = userGroup === 'Student' ? 'student_id' : 'staff_id';
    
        const query = `SELECT * FROM absent_attendance_records WHERE attendance_date=? AND ${column}=?`;
        db.query(query, [date,NULL], (error, result) => {
            if (error) {
                console.error('Error removing record:', error);
                return res.status(500).json({ error: getFriendlyErrorMessage(error)});
            }
    
            console.log(result); 
    
            if (result.length=== 0) {
                return res.status(404).json({ error: 'No Records Found' });
            }
    
            res.json({ message: 'Record fetched successfully' });
        });
    });
    module.exports = router;
    
    
        module.exports = router;  