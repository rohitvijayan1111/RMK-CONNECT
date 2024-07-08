const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db'); 

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

app.use('/auth', authRoutes);
app.use('/mail', emailRoutes);
app.use('/tables', tablesRoutes);
app.use('/graphs', graphRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
