import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventDetails from './EventDetails';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Request_Status.css';

const Request_Status = () => {
  const [eventData, setEventData] = useState([]);
  
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
    const fetchEventData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/hall/hall_requests_status');
        setEventData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
        if (error.response && error.response.data && error.response.data.error) {
          notifyFailure(error.response.data.error);
        } else {
          notifyFailure('An unexpected error occurred.');
        }
      }
    };

    fetchEventData();
  }, []);

  if (eventData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {eventData.map((event, index) => (
        <div className='event-container' key={index}>
          <EventDetails eventData={event} />
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default Request_Status;
