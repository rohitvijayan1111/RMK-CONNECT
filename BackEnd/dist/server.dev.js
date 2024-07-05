"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var cors = require('cors');

var db = require('./config/db'); // Adjust path as per your project structure


var app = express();
var PORT = process.env.PORT || 3000; // Middleware

app.use(bodyParser.json());
app.use(cors()); // Routes

var authRoutes = require('./routes/auth');

var userRoutes = require('./routes/users');

var clubActivitiesRoutes = require('./routes/clubActivities');

var guestLecturesRoutes = require('./routes/guestlecture');

var hallBookingsRoutes = require('./routes/hallbooking');

var notificationsRoutes = require('./routes/notifications');

var emailRoutes = require('./routes/emailsender');

var tablesRoutes = require('./routes/tables');

var graphRoutes = require('./routes/graph'); // Route handling


app.use('/auth', authRoutes);
app.use('/mail', emailRoutes);
app.use('/tables', tablesRoutes);
app.use('/graphs', graphRoutes);
/*
app.use('/users', userRoutes);
app.use('/club-activities', clubActivitiesRoutes);
app.use('/guest-lectures', guestLecturesRoutes);
app.use('/hall-bookings', hallBookingsRoutes);
app.use('/notifications', notificationsRoutes);
*/
// Start the server

app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});