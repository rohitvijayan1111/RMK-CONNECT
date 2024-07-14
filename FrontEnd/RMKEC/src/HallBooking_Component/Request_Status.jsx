import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventDetails from './EventDetails';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Request_Status.css';

const Request_Status = () => {
  const [eventData, setEventData] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const role = window.localStorage.getItem("userType");

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
        const response = await axios.post('http://localhost:3000/hall/hall_requests_status', {
          department: window.localStorage.getItem("department"),
          role: role
        });
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
  }, [role]); // Fetch data when role changes

  const handleEventApproval = async (eventId) => {
    try {
      await axios.put('http://localhost:3000/hall/approveEvent', {
        eventId,
        userType: role
      });

      // Update approved events state
      setApprovedEvents([...approvedEvents, eventId]);
    } catch (error) {
      console.error('Error updating approval:', error);
    }
  };

  return (
    <div>
      {eventData.map((event, index) => (
        <div className='event-container' key={index}>
          {((role === 'hod' || role === 'Event Coordinator') ||
            (role === 'academic_coordinator' && event.approvals.hod) ||
            (role === 'Principal' && event.approvals.hod && event.approvals.academic_coordinator)) && (
              <EventDetails
                needbutton={true}
                checkall={approvedEvents.includes(event.id)} // Pass whether event is approved
                eventData={event}
                onApprove={() => handleEventApproval(event.id)} // Pass approval handler
              />
            )}
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default Request_Status;
