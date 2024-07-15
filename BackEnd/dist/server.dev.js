"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var cors = require('cors');

var db = require('./config/db');

var cron = require('node-cron');

var app = express();
var PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

var authRoutes = require('./routes/auth');

var userRoutes = require('./routes/users');

var clubActivitiesRoutes = require('./routes/clubActivities');

var guestLecturesRoutes = require('./routes/guestlecture');

var hallBookingsRoutes = require('./routes/hallbooking');

var notificationsRoutes = require('./routes/notifications');

var emailRoutes = require('./routes/emailsender');

var tablesRoutes = require('./routes/tables');

var graphRoutes = require('./routes/graph');

var formRoutes = require('./routes/forms');

var attendanceRoutes = require('./routes/attendance');

app.use('/auth', authRoutes);
app.use('/mail', emailRoutes);
app.use('/tables', tablesRoutes);
app.use('/graphs', graphRoutes);
app.use('/forms', formRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/hall', hallBookingsRoutes);
cron.schedule('0 0 * * *', function () {
  console.log('Cron job triggered every minute.');
  var resetQuery = "\n    UPDATE membercount\n    SET \n      todayabsentcount_year_I = 0,\n      todayabsentcount_year_II = 0,\n      todayabsentcount_year_III = 0,\n      todayabsentcount_year_IV = 0,\n      todayabsentcount_staff = 0;\n  ";
  db.query(resetQuery, function (error, results, fields) {
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
app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});