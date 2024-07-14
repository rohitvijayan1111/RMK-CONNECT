import React, { useState } from 'react';
import './EventDetails.css';
import { FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaChalkboardTeacher, FaTools, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import dayjs from 'dayjs';

const EventDetails = ({ eventData, needbutton, checkall }) => {
  const user = window.localStorage.getItem("userType");
  console.log(eventData.department);
  // State to manage approvals
  const [approvals, setApprovals] = useState({
    hod: eventData.approvals.hod,
    academic_coordinator: eventData.approvals.academic_coordinator,
    Principal: eventData.approvals.principal
  });

  const determineEndpoint = (userType) => {
    switch (userType) {
      case 'hod':
        return 'approveEventByHOD';
      case 'academic_coordinator':
        return 'approveEventByAcademicCoordinator';
      case 'Principal':
        return 'approveEventByPrincipal';
      default:
        throw new Error('Invalid user type');
    }
  };
  function capitalizeEachWord(str) {
    // Split the string into words
    let words = str.split(' ');
  
    // Capitalize each word
    let capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  
    // Join the capitalized words back into a single string
    return capitalizedWords.join(' ');
  }
  const handleApprove = async () => {
    try {
      // Update approval status in backend
      await axios.put('http://localhost:3000/hall/approveEvent', {
        eventId: eventData.id,
        userType: user
      });

      // Update local approval state
      const updatedApprovals = { ...approvals, [user]: true };
      setApprovals(updatedApprovals);

      // If all approvals are granted, proceed to add to hall allotment
      if (updatedApprovals.hod && updatedApprovals.academic_coordinator && updatedApprovals.Principal) {
        await addHallAllotment();
      }

      // Determine endpoint based on user type
      const endpoint = determineEndpoint(user);

      // Prepare email content for approval notification
      const formattedDate = dayjs(eventData.event_date).format('MMMM DD, YYYY');
      const formContent = `
You have a new hall booking approval request for the event "${eventData.name}" scheduled on ${formattedDate} from ${eventData.start_time} to ${eventData.end_time} at ${eventData.hall_name}.

Event Name: ${eventData.name}
Speaker: ${eventData.speaker}
Speaker Description: ${eventData.speaker_description}
Department: ${eventData.department}
Participants: ${eventData.participants}
In-charge Faculty: ${eventData.incharge_faculty}
Facilities Needed: ${eventData.facility_needed}
`;

      // Send email notification
      await axios.post(`http://localhost:3000/mail/${endpoint}`, {
        formSubject: formContent,
        department: capitalizeEachWord(eventData.department),
        emails: eventData.emails
      });
    } catch (error) {
      console.error('Error updating approval:', error);
    }
  };

  const addHallAllotment = async () => {
    try {
      // Prepare data for adding to hall allotment
      const { id, ...rest } = eventData;
      const eventDataWithoutApprovals = {
        ...rest,
        event_date: dayjs(eventData.event_date).format('YYYY-MM-DD')
      };

      // Add to hall allotment in backend
      await axios.post('http://localhost:3000/hall/addToHallAllotment', eventDataWithoutApprovals);

      // Delete hall request after approval
      await axios.delete(`http://localhost:3000/hall/deletehallrequest/${id}`);
      
      console.log('Event added to hall allotment');
    } catch (error) {
      console.error('Error adding to hall allotment:', error);
    }
  };

  // Format date for display
  const formattedDate = dayjs(eventData.event_date).format('MMMM DD, YYYY');

  return (
    <div className="event-detail">
      <h2>{eventData.name}</h2>
      <div className="event-content">
        <div className="event-row">
          <div className="event-item">
            <FaUser className="icon" />
            <div>
              <h4>Speaker</h4>
              <p>{eventData.speaker}</p>
              <p className="description">{eventData.speaker_description}</p>
            </div>
          </div>
          <div className="event-item">
            <FaCalendarAlt className="icon" />
            <div>
              <h4>Date</h4>
              <p>{formattedDate}</p>
            </div>
          </div>
          <div className="event-item">
            <FaClock className="icon" />
            <div>
              <h4>Time</h4>
              <p>{eventData.start_time} - {eventData.end_time}</p>
            </div>
          </div>
        </div>
        <div className="event-row">
          <div className="event-item">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h4>Venue</h4>
              <p>{eventData.hall_name}</p>
            </div>
          </div>
          <div className="event-item">
            <FaUsers className="icon" />
            <div>
              <h4>Participants</h4>
              <p>{eventData.participants}</p>
            </div>
          </div>
          <div className="event-item">
            <FaChalkboardTeacher className="icon" />
            <div>
              <h4>In-charge Faculty</h4>
              <p>{eventData.incharge_faculty}</p>
            </div>
          </div>
          <div className="event-item">
            <FaTools className="icon" />
            <div>
              <h4>Facilities Needed</h4>
              <p>{eventData.facility_needed}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="approvals">   
        <div className="approval-item">
          <span>HoD</span>
          {(approvals.hod || checkall) && <FaCheckCircle className="approval-icon" />}
        </div>
        <div className="approval-item">
          <span>Academic Coordinator</span>
          {(approvals.academic_coordinator || checkall) && <FaCheckCircle className="approval-icon" />}
        </div>
        <div className="approval-item">
          <span>Principal</span>
          {(approvals.Principal || checkall ) && <FaCheckCircle className="approval-icon" />}
        </div>
      </div>
      {(needbutton && user !== "Event Coordinator" && !approvals[user]) && (
        <div className="approve-button">
          <button onClick={handleApprove}>Approve</button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
