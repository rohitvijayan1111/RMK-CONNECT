import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventDetails from './EventDetails';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DashBoard_Hall.css';

function DashBoard_Hall() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const notifyFailure = (error) => {
    toast.error(error, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const response = await axios.get('http://localhost:3000/hall/upcoming-events');
        setUpcomingEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        if (error.response && error.response.data) {
          console.log('Error message from backend:', error.response.data);
          notifyFailure(error.response.data.error);  
        } else {
          notifyFailure('An unexpected error occurred.');
        }
        setLoading(false);
      }
    }

    fetchUpcomingEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-hall">
      <h2>Upcoming Events</h2>
      {upcomingEvents.length === 0 ? (
        <p>No upcoming events found.</p>
      ) : (
        upcomingEvents.map((event, index) => (
          <div className="event-container" key={index}>
            <EventDetails checkall={true} showdelete={true} eventData={event} />
          </div>
        ))
      )}
      <ToastContainer />
    </div>
  );
}

export default DashBoard_Hall;
