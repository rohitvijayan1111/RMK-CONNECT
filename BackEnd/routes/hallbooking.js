const express = require('express');
const router = express.Router();
const db = require('../config/db');
const util = require('util');
const { error } = require('console');

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

// Fetch all halls
router.get('/availablehalls', async (req, res) => {
    const sql = 'SELECT * FROM halls';
    try {
        const result = await query(sql);
        const transformedHalls = result.map((hall) => ({
            id: hall.id,
            name: hall.hall_name,
            image: hall.image_path,
            location: hall.hall_location,
            capacity: hall.capacity,
            facilities: hall.facilities.split(',')
        }));
        res.json(transformedHalls);
    } catch (err) {
        console.error('Error fetching halls:', err);
        res.status(500).json({ error: 'Failed to fetch halls' });
    }
});

// Fetch hall names for dropdown
router.get('/halls', async (req, res) => {
    const sql = 'SELECT hall_name FROM halls';
    try {
        const results = await query(sql);
        res.json(results);
    } catch (err) {
        console.error('Error fetching hall names:', err);
        res.status(500).json({ error: 'Failed to fetch hall names' });
    }
});

router.post('/hall-request', async (req, res) => {
    const {
        name, speaker, speaker_description, event_date, start_time,
        end_time, hall_name, participants, incharge_faculty, facility_needed,department
    } = req.body;

    const checkQuery = `SELECT * FROM hall_allotment WHERE hall_name = ? AND event_date = ? AND (
                        (start_time < ? AND end_time > ?) OR
                        (start_time < ? AND end_time > ?) OR
                        (start_time >= ? AND end_time <= ?))`;

    try {
        const results = await query(checkQuery, [hall_name, event_date, start_time, start_time, end_time, end_time, start_time, end_time]);
        if (results.length > 0) {
            return res.status(400).json({ error: 'Hall is not available for the requested time and date.' });
        }

        const insertRequestQuery = `INSERT INTO hall_request (name, speaker, speaker_description, event_date, start_time, end_time, hall_name, participants, incharge_faculty, facility_needed,department)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

        await query(insertRequestQuery, [name, speaker, speaker_description, event_date, start_time, end_time, hall_name, participants, incharge_faculty, facility_needed,department]);
        res.send('Hall request submitted');
    } catch (err) {
        console.error('Error processing hall request:', err);
        res.status(500).json({ error: getFriendlyErrorMessage(err)});
    }
});
router.post('/hall_requests_status', (req, res) => {
  const { department, role } = req.body;
  let query = 'SELECT * FROM hall_request';

  if (role === 'hod' || role === 'Event Coordinator') {
      query += ' WHERE department = ?';
  }
  console.log(query);
  db.query(query, [department], (err, results) => {
      if (err) {
          console.error('Error fetching data:', err);
          res.status(500).send({ error: getFriendlyErrorMessage(err) });
          return;
      }
      if (results.length == 0) {
          return res.status(404).json({ error: "No Records found" });
      }
      const formattedEvents = results.map(event => ({
        id: event.id,
        name: event.name,
        speaker: event.speaker,
        speaker_description: event.speaker_description,
        event_date:event.event_date,
        start_time:event.start_time,
        end_time:event.end_time,
        department:event.department,
        hall_name: event.hall_name,
        participants: event.participants,
        incharge_faculty: event.incharge_faculty,
        facility_needed: event.facility_needed,
        approvals: {
            hod: event.hod_approval === 1,
            academic_coordinator: event.academic_coordinator_approval === 1,
            principal: event.principal_approval === 1
        }
      }));

      res.json(formattedEvents);
  });
});


router.post('/past-events', async (req, res) => {
  const { department, role } = req.body;
  let sql = `
    SELECT *
    FROM hall_allotment
    WHERE event_date < CURDATE()
      OR (event_date = CURDATE() AND end_time < CURTIME())
  `;

  if (role === 'hod' || role === 'Event Coordinator') {
    sql += ' AND department = ?';
  }

  try {
    const results = await query(sql, [department]);
    if (results.length === 0) {
      return res.status(404).json({ error: "No records found" });
    }
    const formattedEvents = results.map(event => ({
      id: event.id,
      name: event.name,
      speaker: event.speaker,
      speaker_description: event.speaker_description,
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
      department: event.department,
      hall_name: event.hall_name,
      participants: event.participants,
      incharge_faculty: event.incharge_faculty,
      facility_needed: event.facility_needed,
      approvals: {
        hod: event.hod_approval === 1,
        academic_coordinator: event.academic_coordinator_approval === 1,
        principal: event.principal_approval === 1
      }
    }));
    res.json(formattedEvents);
  } catch (err) {
    console.error('Error fetching past events:', err);
    res.status(500).json({ error: 'Server error occurred' });
  }
});

  router.get('/upcoming-events', async (req, res) => {
    const sql = `
    SELECT *
    FROM hall_allotment
    WHERE 
      (
        event_date > CURDATE()
        OR (event_date = CURDATE() AND start_time > CURTIME())  -- Include events not started yet today
        OR (event_date = CURDATE() AND end_time >= CURTIME() AND start_time <= CURTIME())  -- Include ongoing events today
      )
    ORDER BY event_date, start_time;
  `;
  
    try {
      const results = await query(sql);
      if (results.length === 0) {
        return res.status(404).json({ error: "No upcoming events found" });
      }
      const formattedEvents = results.map(event => ({
        id: event.id,
          name: event.name,
          speaker: event.speaker,
          speaker_description: event.speaker_description,
          date: event.event_date,
          from: event.start_time,
          to: event.end_time,
          event_date:event.event_date,
          start_time:event.start_time,
          end_time:event.end_time,
          department:event.department,
          hall_name: event.hall_name,
          participants: event.participants,
          incharge_faculty: event.incharge_faculty,
          facility_needed: event.facility_needed,
          approvals: {
              hod: event.hod_approval === 1,
              academic_coordinator: event.academic_coordinator_approval === 1,
              principal: event.principal_approval === 1
          }
      }));
      res.json(formattedEvents);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
      res.status(500).json({ error: 'Server error occurred' });
    }
  });
  
  router.put('/approveEvent', async (req, res) => {
    const { eventId, userType } = req.body;
  
    const sql = `UPDATE hall_request SET \`${userType}_approval\` = 1 WHERE id = ?`;
    await query(sql, [eventId], (err, result) => {
      if (err) {
        console.error('Error updating approval:', err);
        res.status(500).json({ error: 'Error updating approval' });
      } else {
        console.log(`${userType} approval updated for event ID ${eventId}`);
        res.status(200).json({ message: 'Approval updated successfully' });
      }
    });
  });
  
  router.post('/addToHallAllotment', async (req, res) => {
    console.log("THE REQUESTEDD BODY IS "+ req.body);
    const data = req.body;
    delete data.approvals;
    const sql = `INSERT INTO hall_allotment SET ?`;
    await query(sql, [data], (err, result) => {
      if (err) {
        console.error('Error adding to hall allotment:', err);
        res.status(500).json({ error: 'Error adding to hall allotment' });
      } else {
        console.log('Event added to hall allotment');
        res.status(200).json({ message: 'Event added to hall allotment successfully' });
      }
    });
  });

  router.delete('/deletehallrequest/:id', (req, res) => {
    const id = req.params.id;
  
    const query = 'DELETE FROM hall_request WHERE id = ?';
  
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error deleting hall request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Hall request not found' });
        return;
      }
  
      res.status(200).json({ message: 'Hall request deleted successfully' });
    });
  });
    
module.exports = router;
