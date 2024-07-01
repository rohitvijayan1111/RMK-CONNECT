const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const clubActivitiesRoutes = require('./routes/clubActivities');
const guestLecturesRoutes = require('./routes/guestlecture');
const hallBookingsRoutes = require('./routes/hallbooking');
const notificationsRoutes = require('./routes/notifications');

// Route handling
app.use('/auth', authRoutes);
/*
app.use('/users', userRoutes);
app.use('/club-activities', clubActivitiesRoutes);
app.use('/guest-lectures', guestLecturesRoutes);
app.use('/hall-bookings', hallBookingsRoutes);
app.use('/notifications', notificationsRoutes);
*/
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
