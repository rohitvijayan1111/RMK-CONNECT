"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var cors = require('cors'); // Middleware


app.use(bodyParser.json());
app.use(cors()); // Routes

var authRoutes = require('./routes/auth');

var userRoutes = require('./routes/users');

var clubActivitiesRoutes = require('./routes/clubActivities');

var guestLecturesRoutes = require('./routes/guestlecture');

var hallBookingsRoutes = require('./routes/hallbooking');

var notificationsRoutes = require('./routes/notifications');

var EmailRoutes = require('./routes/emailsender'); // Route handling


app.use('/auth', authRoutes);
app.use('/mail', EmailRoutes);
/*
app.use('/users', userRoutes);
app.use('/club-activities', clubActivitiesRoutes);
app.use('/guest-lectures', guestLecturesRoutes);
app.use('/hall-bookings', hallBookingsRoutes);
app.use('/notifications', notificationsRoutes);
*/
// Start the server

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});