const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db'); // Adjust path as per your project structure

const app = express();
const PORT = process.env.PORT || 3000;

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
const emailRoutes = require('./routes/emailsender');
const tablesRoutes = require('./routes/tables');
const graphRoutes = require('./routes/graph');
// Route handling
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
