const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db'); 
const cron = require('node-cron');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const clubActivitiesRoutes = require('./routes/clubActivities');
const guestLecturesRoutes = require('./routes/guestlecture');
const hallBookingsRoutes = require('./routes/hallbooking');
const notificationsRoutes = require('./routes/notifications');
const emailRoutes = require('./routes/emailsender');
const tablesRoutes = require('./routes/tables');
const graphRoutes = require('./routes/graph');
const formRoutes = require('./routes/forms');
const attendanceRoutes = require('./routes/attendance');

app.use('/auth', authRoutes);
app.use('/mail', emailRoutes);
app.use('/tables', tablesRoutes);
app.use('/graphs', graphRoutes);
app.use('/forms', formRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/hall', hallBookingsRoutes);

cron.schedule('0 0 * * *', () => {
  console.log('Cron job triggered every minute.');

  const resetQuery = `
    UPDATE membercount
    SET 
      todayabsentcount_year_I = 0,
      todayabsentcount_year_II = 0,
      todayabsentcount_year_III = 0,
      todayabsentcount_year_IV = 0,
      todayabsentcount_staff = 0;
  `;

  db.query(resetQuery, (error, results, fields) => {
    if (error) {
      console.error('Error resetting counts:', error.message);
    } else {
      console.log('Counts reset successfully.');
    }
  });
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
