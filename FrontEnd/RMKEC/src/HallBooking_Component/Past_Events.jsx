import React, { useEffect, useState } from 'react';
import EventDetails from './EventDetails';
import axios from 'axios';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Past_Events.css';

function Past_Events() {
  const [events, setEvents] = useState([]);
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
    async function fetchPastEvents() {
      try {
        const response = await axios.post('http://localhost:3000/hall/past-events', {
              department:window.localStorage.getItem("department"),
              role: window.localStorage.getItem("userType")
      });
        setEvents(response.data);
        setLoading(false); 
      } catch (error) {
        if (error.response && error.response.data) {
          console.log('Error message from backend:', error.response.data);
          notifyFailure(error.response.data.error);  
        } else {
          notifyFailure('An unexpected error occurred.');
        }
        console.error('Error fetching past events:', error);
        setLoading(false); 
      }
    }
  
    fetchPastEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      {events.length === 0 && <p>NO DATA</p>}
      {events.map((event, index) => (
        <div className="event-container" key={index}>
          <EventDetails needbutton={false} eventData={event} />
        </div>
      ))}
      <ToastContainer />
    </div>
  );
}

export default Past_Events;
