import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import EventDetails from './EventDetails';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Request_Status.css';
import dayjs from 'dayjs';
import pending from '../assets/pending.png';

const Request_Status = () => {
  const [eventData, setEventData] = useState([]);
  const role = window.localStorage.getItem("userType");
  const department = window.localStorage.getItem("department");
  const [name, setName] = useState("");
  const [hasError, setHasError] = useState(false); // State to track if an error occurred
  const fetchEventDataRef = useRef(false);

  const rolemapping = {
    'hod': "HOD",
    "academic_coordinator": "Academic Coordinator",
    "principal": "Principal",
    "Event Coordinator": "Event Coordinator"
  };

  const determineEndpoint = (userType) => {
    switch (userType) {
      case 'hod':
        return 'cancelEventByHOD';
      case 'academic_coordinator':
        return 'cancelEventByAcademicCoordinator';
      case 'principal':
        return 'cancelEventByPrincipal';
      case "Event Coordinator":
        return 'cancelEventByEventCoordinator';
      default:
        throw new Error('Invalid user type');
    }
  };

  const notifyFailure = (error) => {
    toast.info(error, {
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
    if (fetchEventDataRef.current) return; // Prevent multiple requests
    fetchEventDataRef.current = true;

    const fetchEventData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/hall/hall_requests_status', {
          department,
          role
        });
        setEventData(response.data);
        setHasError(false); // Reset error state when data is successfully fetched
      } catch (error) {
        console.error('Error fetching data', error);
        if (error.response && error.response.data && error.response.data.error) {
          
          setName(error.response.data.error);
          setHasError(true); // Set error state to true if there's an error
        } else {
          notifyFailure('An unexpected error occurred.');
          setHasError(true); // Set error state to true for unexpected errors
        }
      }
    };

    fetchEventData();
  }, [department, role]);

  const handleDelete = async (event) => {
    try {
      await axios.post('http://localhost:3000/hall/hall_requests_remove', { id: event.id });
      setEventData(eventData.filter((e) => e.id !== event.id));
      const endpoint = determineEndpoint(role);
      const formattedDate = dayjs(event.event_date).format('MMMM DD, YYYY');
      const formContent = `
      Hall booking approval request for the event "${event.name}" scheduled on ${formattedDate} from ${event.start_time} to ${event.end_time} at ${event.hall_name} is cancelled by ${rolemapping[role]}.
      Event Name: ${event.name}
      Speaker: ${event.speaker}
      Speaker Description: ${event.speaker_description}
      Department: ${event.department}
      Participants: ${event.participants}
      In-charge Faculty: ${event.incharge_faculty}
      Facilities Needed: ${event.facility_needed}
      `;

      await axios.post(`http://localhost:3000/mail/${endpoint}`, {
        formSubject: formContent,
        department: event.department,
        emails: event.emails
      });

    } catch (error) {
      console.error('Error deleting event:', error);
      notifyFailure('Error deleting event');
    }
  };

  return (
    <div>
      <h1>Request Status</h1>
      
      {hasError ? (
        <div style={{ textAlign: 'center',width:'100%', height:'100%'}}>
          <img src={pending} alt="Error occurred" style={{ width: '50%', height: '50%'}} />
        </div>
      ) : (
        eventData.map((event, index) => (
          <div className='event-container' key={index}>
            {((role === 'hod' || role === 'Event Coordinator') ||
              (role === 'academic_coordinator' && event.approvals.hod) ||
              (role === 'Principal' && event.approvals.hod && event.approvals.academic_coordinator)) && (
                <EventDetails needbutton={true} checkall={false} eventData={event} showdelete={true} onDelete={() => handleDelete(event.id)} />
              )}
          </div>
        ))
      )}
      <ToastContainer />
    </div>
  );
};

export default Request_Status;
