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
const query = util.promisify(db.query).bind(db);

router.post('/addabsent', async (req, res) => {
    const data = req.body;
    console.log('Received data:', data);

    if (!data) {
        console.error('Data is required');
        return res.status(400).json({ error: 'Data is required' });
    }

    try {
        let existingRecord;
        if (data.student_id) {
            console.log('Processing student_id:', data.student_id);
            const studentDetails = await query('SELECT year FROM students WHERE id = ?', [data.student_id]);
      
            console.log('Query executed for student_id:', data.student_id);
            console.log('Student details:', studentDetails);
      
            if (!studentDetails || studentDetails.length === 0) {
                console.error('Student not found or missing year information');
                return res.status(404).json({ error: 'Student not found or missing year information' });
            }
            const year = studentDetails[0].year;
            console.log('Year:', year);
      
            if (!year) {
                console.error('Year information missing for the student');
                return res.status(404).json({ error: 'Year information missing for the student' });
            }
      
            const updateField = `todayabsentcount_year_${year}`;
            console.log('Update field:', updateField);
            const updateQuery = `
                UPDATE MemberCount 
                SET ${updateField} = ${updateField} + 1 
                WHERE department_name = ?`;
            console.log('Executing query:', updateQuery);
            await query(updateQuery, [data.department_name]);

            existingRecord = await query('SELECT * FROM absent_attendance_records WHERE student_id = ? AND attendance_date = ?', [data.student_id, data.attendance_date]);
      
        } else if (data.staff_id) {
            console.log('Processing staff_id:', data.staff_id);
            const updateQuery = `
                UPDATE MemberCount 
                SET todayabsentcount_staff = todayabsentcount_staff + 1 
                WHERE department_name = ?`;
            console.log('Executing query:', updateQuery);
            await query(updateQuery, [data.department_name]);

            // Check if the record already exists
            existingRecord = await query('SELECT * FROM absent_attendance_records WHERE staff_id = ? AND attendance_date = ?', [data.staff_id, data.attendance_date]);
      
        } else {
            console.error('Invalid data format');
            return res.status(400).json({ error: 'Invalid data format' });
        }

        if (existingRecord && existingRecord.length > 0) {
            console.log('Record already exists:', existingRecord);
            return res.status(400).json({ error: 'Record already exists for this date and user' });
        }

        console.log('Data to insert:', data);
        const insertQuery = 'INSERT INTO absent_attendance_records SET ?';
        console.log('Executing insert query:', insertQuery, data);
        await query(insertQuery, data);

        res.json({ message: 'Record inserted successfully' });
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getStudentYear(student_id) {
    const result = await query('SELECT year FROM students WHERE id = ?', [student_id]);
    return result.length > 0 ? result[0].year : null;
}

router.post('/removeabsent', async (req, res) => {
    const { date, rollnumber, userGroup, department_name } = req.body;
    if (!date || !rollnumber || !userGroup || !department_name) {
        return res.status(400).json({ error: 'Date, Roll Number, User Group, and Department Name are required' });
    }
    console.log(userGroup);
    const column = userGroup === 'Student' ? 'student_id' : 'staff_id';

    try {
        // Check if the attendance record exists
        const checkQuery = `SELECT * FROM absent_attendance_records WHERE attendance_date=? AND ${column}=?`;
        const records = await query(checkQuery, [date, rollnumber]);
        if (records.length === 0) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        if (userGroup === 'Student') {
            const studentYear = await getStudentYear(rollnumber);
            if (!studentYear) {
                return res.status(404).json({ error: 'Student year not found' });
            }

            const updateField = `todayabsentcount_year_${studentYear}`;
            const decrementQuery = `
                UPDATE MemberCount 
                SET ${updateField} = ${updateField} - 1 
                WHERE department_name = ?`;
            console.log(`Executing query: ${decrementQuery} with department_name: ${department_name}`);
            const result = await query(decrementQuery, [department_name]);
            console.log(`Update result: ${JSON.stringify(result)}`);

        } else if (userGroup === 'Staff') {
            const decrementQuery = `
                UPDATE MemberCount 
                SET todayabsentcount_staff = todayabsentcount_staff - 1 
                WHERE department_name = ?`;
            console.log(`Executing query: ${decrementQuery} with department_name: ${department_name}`);
            const result = await query(decrementQuery, [department_name]);
            console.log(`Update result: ${JSON.stringify(result)}`);
        }

        const deleteResult = await query(`DELETE FROM absent_attendance_records WHERE attendance_date=? AND ${column}=?`, [date, rollnumber]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({ message: 'Record removed successfully' });
    } catch (error) {
        console.error('Error removing record:', error);
        res.status(500).json({ error: 'Error removing record' });
    }
});

router.post('/getindividual', async (req, res) => {
    const { rollnumber, userGroup } = req.body;
  
    if (!rollnumber || !userGroup) {
        return res.status(400).json({ error: 'Roll Number and User Group are required' });
    }
  
    const column = userGroup === 'Student' ? 'student_id' : 'staff_id';
  
    try {
        const result = await query(`SELECT * FROM absent_attendance_records WHERE ${column}=?`, [rollnumber]);

        if (result.length == 0) {
            return res.status(400).json({ error: "Record does not Exist" });
        }

        res.json(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

router.post('/fetchtoday', async (req, res) => {
    console.log('Received request body:', req.body);
    const userGroup = req.body.selectedUserGroup;
    const currentDate = new Date();
    const department = req.body.department;
    const formattedDate = currentDate.toISOString().slice(0, 10);

    if (!userGroup || !department) {
        return res.status(400).json({ error: 'User Group and Department are required' });
    }

    let queryStr, params;
    if (department==="All") {
        if (userGroup === 'Student') {
            queryStr = `
                SELECT 
                    s.name AS name,
                    s.academic_year AS academic_year,
                    s.department AS dept,
                    s.parent_mail AS parent_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM students s
                INNER JOIN absent_attendance_records a ON s.id = a.student_id
                WHERE a.attendance_date = ? AND s.department IS NOT NULL;
            `;
            params = [formattedDate];
        } else if (userGroup === 'Staff') {
            queryStr = `
                SELECT 
                    st.name AS name,
                    st.department AS dept,
                    st.email AS staff_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM staffs st
                INNER JOIN absent_attendance_records a ON st.id = a.staff_id
                WHERE a.attendance_date = ? AND st.department IS NOT NULL;
            `;
            params = [formattedDate];
        } else {
            return res.status(400).json({ error: 'Invalid User Group' });
        }
    } else {
        if (userGroup === 'Student') {
            queryStr = `
                SELECT 
                    s.name AS name,
                    s.academic_year AS academic_year,
                    s.department AS dept,
                    s.parent_mail AS parent_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM students s
                INNER JOIN absent_attendance_records a ON s.id = a.student_id
                WHERE a.attendance_date = ? AND s.department = ?;
            `;
            params = [formattedDate, department];
        } else if (userGroup === 'Staff') {
            queryStr = `
                SELECT 
                    st.name AS name,
                    st.department AS dept,
                    st.email AS staff_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM staffs st
                INNER JOIN absent_attendance_records a ON st.id = a.staff_id
                WHERE a.attendance_date = ? AND st.department = ?;
            `;
            params = [formattedDate, department];
        } else {
            return res.status(400).json({ error: 'Invalid User Group' });
        }
    }

    console.log('Executing query:', queryStr);
    console.log('With params:', params);

    try {
        const results = await query(queryStr, params);

        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'No Records Found' });
        }

        res.json({ message: 'Records fetched successfully', data: results });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Error fetching records' });
    }
});

router.post('/fetchdatedata', async (req, res) => {
    console.log('Received request body:', req.body);
    const userGroup = req.body.selectedUserGroup;
    const currentDate = req.body.date;
    console.log('Received request body:', req.body);
    const department = req.body.department;
    const formattedDate = currentDate;

    if (!userGroup || !department) {
        return res.status(400).json({ error: 'User Group and Department are required' });
    }

    let queryStr, params;
    if (department==="All") {
        if (userGroup === 'Student') {
            queryStr = `
                SELECT 
                    s.name AS name,
                    s.academic_year AS academic_year,
                    s.department AS dept,
                    s.parent_mail AS parent_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM students s
                INNER JOIN absent_attendance_records a ON s.id = a.student_id
                WHERE a.attendance_date = ? AND s.department IS NOT NULL;
            `;
            params = [formattedDate];
        } else if (userGroup === 'Staff') {
            queryStr = `
                SELECT 
                    st.name AS name,
                    st.department AS dept,
                    st.email AS staff_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM staffs st
                INNER JOIN absent_attendance_records a ON st.id = a.staff_id
                WHERE a.attendance_date = ? AND st.department IS NOT NULL;
            `;
            params = [formattedDate];
        } else {
            return res.status(400).json({ error: 'Invalid User Group' });
        }
    } else {
        if (userGroup === 'Student') {
            queryStr = `
                SELECT 
                    s.name AS name,
                    s.academic_year AS academic_year,
                    s.department AS dept,
                    s.parent_mail AS parent_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM students s
                INNER JOIN absent_attendance_records a ON s.id = a.student_id
                WHERE a.attendance_date = ? AND s.department = ?;
            `;
            params = [formattedDate, department];
        } else if (userGroup === 'Staff') {
            queryStr = `
                SELECT 
                    st.name AS name,
                    st.department AS dept,
                    st.email AS staff_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM staffs st
                INNER JOIN absent_attendance_records a ON st.id = a.staff_id
                WHERE a.attendance_date = ? AND st.department = ?;
            `;
            params = [formattedDate, department];
        } else {
            return res.status(400).json({ error: 'Invalid User Group' });
        }
    }

    console.log('Executing query:', queryStr);
    console.log('With params:', params);

    try {
        const results = await query(queryStr, params);

        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'No Records Found' });
        }

        res.json({ message: 'Records fetched successfully', data: results });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Error fetching records' });
    }
});
router.post('/attendance-summary', async (req, res) => {
    const { department} = req.body;
    
    if (!department) {
        return res.status(400).json({ error: 'Department is required' });
    }
   
    try {
        const results = await query('SELECT * FROM membercount WHERE department_name = ?', [department]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        const row = results[0];
        const data = [
            {
                name: "I YR",
                present: row.year_I_count - row.todayabsentcount_year_I,
                absent: row.todayabsentcount_year_I,
            },
            {
                name: "II YR",
                present: row.year_II_count - row.todayabsentcount_year_II,
                absent: row.todayabsentcount_year_II,
            },
            {
                name: "III YR",
                present: row.year_III_count - row.todayabsentcount_year_III,
                absent: row.todayabsentcount_year_III,
            },
            {
                name: "IV YR",
                present: row.year_IV_count - row.todayabsentcount_year_IV,
                absent: row.todayabsentcount_year_IV,
            },
            {
                name:'Staff',
                present:row. staff_count-row.todayabsentcount_staff,
                absent:row.todayabsentcount_staff
            }
        ];
        res.json(data);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/attendance-count-summary', async (req, res) => {
    const { department } = req.body;
    
    if (!department) {
        return res.status(400).json({ error: 'Department is required' });
    }

    try {
        const results = await query('SELECT * FROM membercount WHERE department_name = ?', [department]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        const row = results[0];

        const total_student = row.year_I_count + row.year_II_count + row.year_III_count + row.year_IV_count;
        const absent_student = row.todayabsentcount_year_I + row.todayabsentcount_year_II + row.todayabsentcount_year_III + row.todayabsentcount_year_IV;
        const total_staff = row.staff_count;
        const absent_staff = row.todayabsentcount_staff;
        
        const data = {
            Total_students: total_student,
            Student_Present: total_student - absent_student,
            Student_Absent: absent_student,
            Total_staff: total_staff,
            Staff_Present: total_staff - absent_staff,
            Staff_Absent: absent_staff
        };

        res.json(data);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/attendance-graph', async (req, res) => {
    const { user, department} = req.body;
    console.log(req.body);
    if (!department || !user) {
        return res.status(400).json({ error: 'Department and user type are required' });
    }

    let column;
    if (user === 'Student') {
        column = "student_id";
    } else {
        column = "staff_id";
    }

    try {
        const results = await query(`SELECT attendance_date as date, count(*) as total FROM absent_attendance_records WHERE department_name = ? AND ${column} IS NOT NULL GROUP BY date LIMIT 7`, [department]);
        console.log('Query results:', results);

        if (results.length === 0) {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
            return res.json({
                name: formattedDate,
                absent: 0
            });
        }
        

        const formattedResults = results.map(row => {
            const date = new Date(row.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            return {
                name: formattedDate,
                absent: row.total
            };
        });

        res.json(formattedResults);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/admin-attendance-summary', async (req, res) => {
    const { user } = req.body;

    if (!user) {
        return res.status(400).json({ error: 'User type is required' });
    }

    let queryStr;
    let presentField;
    let absentField;

    if (user.toLowerCase() === 'student') {
        queryStr = `
            SELECT 
                department_name, 
                (SUM(year_I_count) + SUM(year_II_count) + SUM(year_III_count) + SUM(year_IV_count)) AS total_students, 
                (SUM(todayabsentcount_year_I) + SUM(todayabsentcount_year_II) + SUM(todayabsentcount_year_III) + SUM(todayabsentcount_year_IV)) AS total_absent_students
            FROM membercount 
            GROUP BY department_name
        `;
        presentField = 'total_students';
        absentField = 'total_absent_students';
    } else if (user.toLowerCase() === 'faculty') {
        queryStr = `
            SELECT 
                department_name, 
                SUM(staff_count) AS total_staff, 
                SUM(todayabsentcount_staff) AS total_absent_staff
            FROM membercount 
            GROUP BY department_name
        `;
        presentField = 'total_staff';
        absentField = 'total_absent_staff';
    } else {
        return res.status(400).json({ error: 'Invalid user type' });
    }

    try {
        const results = await query(queryStr);

        if (results.length === 0) {
            return res.status(404).json({ error: 'No departments found' });
        }

        const data = results.map(row => ({
            name: row.department_name,
            present: row[presentField] - row[absentField],
            absent: row[absentField]
        }));

        res.json(data);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/admin-attendance-count-summary', async (req, res) => {
    try {
        console.log("INNN");
        const results = await query('SELECT * FROM membercount');
        if (results.length === 0) {
            return res.status(404).json({ error: 'No departments found' });
        }

        let total_student = 0;
        let absent_student = 0;
        let total_staff = 0;
        let absent_staff = 0;

        results.forEach(row => {
            total_student += row.year_I_count + row.year_II_count + row.year_III_count + row.year_IV_count;
            absent_student += row.todayabsentcount_year_I + row.todayabsentcount_year_II + row.todayabsentcount_year_III + row.todayabsentcount_year_IV;
            total_staff += row.staff_count;
            absent_staff += row.todayabsentcount_staff;
        });

        const data = {
            Total_students: total_student,
            Student_Present: total_student - absent_student,
            Student_Absent: absent_student,
            Total_staff: total_staff,
            Staff_Present: total_staff - absent_staff,
            Staff_Absent: absent_staff
        };

        res.json(data);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/admin-attendance-graph', async (req, res) => {
    const { user } = req.body;
    console.log(req.body);
    
    if (!user) {
        return res.status(400).json({ error: 'User type is required' });
    }

    let column;
    if (user === 'Student') {
        column = "student_id";
    } else {
        column = "staff_id";
    }

    try {
        const results = await query(`SELECT attendance_date as date, count(*) as total FROM absent_attendance_records WHERE ${column} IS NOT NULL GROUP BY date LIMIT 7`);
        console.log('Query results:', results);

        if (results.length === 0) {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
            return res.json({
                name: formattedDate,
                absent: 0
            });
        }
        

        const formattedResults = results.map(row => {
            const date = new Date(row.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            return {
                name: formattedDate,
                absent: row.total
            };
        });

        res.json(formattedResults);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
