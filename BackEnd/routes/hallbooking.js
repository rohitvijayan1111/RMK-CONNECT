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
        end_time, hall_name, participants, incharge_faculty, facility_needed
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

        const insertRequestQuery = `INSERT INTO hall_request (name, speaker, speaker_description, event_date, start_time, end_time, hall_name, participants, incharge_faculty, facility_needed)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await query(insertRequestQuery, [name, speaker, speaker_description, event_date, start_time, end_time, hall_name, participants, incharge_faculty, facility_needed]);
        res.send('Hall request submitted');
    } catch (err) {
        console.error('Error processing hall request:', err);
        res.status(500).json({ error: getFriendlyErrorMessage(err)});
    }
});

router.get('/hall_requests_status', (req, res) => {
    const query = 'SELECT * FROM hall_request';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({error:getFriendlyErrorMessage(err)});
        return;
      }
      if(results.length==0)
        {
          return res.status(404).json({error:"No Records found"});
        }
      const formattedEvents = results.map(event => ({
        name: event.name,
        speaker: event.speaker,
        speakerDescription: event.speaker_description,
        date: event.event_date,
        from: event.start_time,
        to: event.end_time,
        hallName: event.hall_name,
        participants: event.participants,
        inchargeFaculty: event.incharge_faculty,
        facilityNeeded: event.facility_needed,
        approvals: {
          hod: event.hod_approval === 1,
          vicePrincipal: event.vice_principal_approval === 1,
          principal: event.principal_approval === 1
        }
      }));
  
      res.json(formattedEvents);
    });
  });

  router.get('/past-events', async (req, res) => {
    const sql = `
      SELECT ha.*, hr.name, hr.speaker, hr.speaker_description, hr.participants, hr.incharge_faculty, hr.facility_needed, hr.hod_approval, hr.vice_principal_approval, hr.principal_approval
      FROM hall_allotment ha
      JOIN hall_request hr ON ha.request_id = hr.id
      WHERE ha.event_date < CURDATE();
    `;
    try {
      const results = await query(sql);
      if (results.length === 0) {
        return res.status(404).json({ error: "No records found" });
      }
      const formattedEvents = results.map(event => ({
        name: event.name,
        speaker: event.speaker,
        speakerDescription: event.speaker_description,
        date: event.event_date,
        from: event.start_time,
        to: event.end_time,
        hallName: event.hall_name,
        participants: event.participants,
        inchargeFaculty: event.incharge_faculty,
        facilityNeeded: event.facility_needed,
        approvals: {
          hod: event.hod_approval === 1,
          vicePrincipal: event.vice_principal_approval === 1,
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
      SELECT ha.*, hr.name, hr.speaker, hr.speaker_description, hr.participants, hr.incharge_faculty, hr.facility_needed, hr.hod_approval, hr.vice_principal_approval, hr.principal_approval
      FROM hall_allotment ha
      JOIN hall_request hr ON ha.request_id = hr.id
      WHERE ha.event_date >= CURDATE();
    `;
    try {
      const results = await query(sql);
      if (results.length === 0) {
        return res.status(404).json({ error: "No upcoming events found" });
      }
      const formattedEvents = results.map(event => ({
        name: event.name,
        speaker: event.speaker,
        speakerDescription: event.speaker_description,
        date: event.event_date,
        from: event.start_time,
        to: event.end_time,
        hallName: event.hall_name,
        participants: event.participants,
        inchargeFaculty: event.incharge_faculty,
        facilityNeeded: event.facility_needed,
        approvals: {
          hod: event.hod_approval === 1,
          vicePrincipal: event.vice_principal_approval === 1,
          principal: event.principal_approval === 1
        }
      }));
      res.json(formattedEvents);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
      res.status(500).json({ error: 'Server error occurred' });
    }
  });
  
module.exports = router;
