import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hall_Request.css';
import dayjs from 'dayjs'; // Import dayjs for date/time formatting
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useNavigate} from 'react-router-dom';
const Hall_Request = () => {
  const [halls, setHalls] = useState([]);
  const [fvalue, setFvalue] = useState(null); 
  const [tvalue, setTvalue] = useState(null);
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    speaker: '',
    speaker_description: '',
    event_date: null,
    start_time: null,
    end_time: null,
    hall_name: 'Hall A', // Default value
    participants: '',
    incharge_faculty: '',
    facility_needed: '',
    department: window.localStorage.getItem("department") || ''
  });

  useEffect(() => {
    axios.get('http://localhost:3000/hall/halls')
      .then(response => setHalls(response.data))
      .catch(error => console.error('Error fetching hall details:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDate = dayjs(formData.event_date).format('YYYY-MM-DD');
    const formattedStartTime = formData.start_time ? dayjs(formData.start_time).format('HH:mm:ss') : null;
    const formattedEndTime = formData.end_time ? dayjs(formData.end_time).format('HH:mm:ss') : null;

    const requestData = {
      ...formData,
      event_date: formattedDate,
      start_time: formattedStartTime,
      end_time: formattedEndTime
    };

    console.log(requestData); 

    axios.post('http://localhost:3000/hall/hall-request', requestData)
      .then(response => alert(response.data))
      .catch(error => alert(error.response.data.error));
    navigate("/dashboard");
  };

  return (
    <form className="Attendance_request">
      <h5>Name Of the Event</h5>
      <input type='text' name='name' value={formData.name} onChange={handleChange} />
      <h5>Speaker</h5>
      <input type='text' name='speaker' value={formData.speaker} onChange={handleChange} />
      <h5>Description of the Speaker</h5>
      <textarea style={{resize:'none'}} name='speaker_description' value={formData.speaker_description} onChange={handleChange}></textarea>
      <h5>Date</h5>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Date"
            value={formData.event_date}
            onChange={(newValue) => setFormData({ ...formData, event_date: newValue })}
            renderInput={(params) => <TextField {...params} className="custom-date-picker" />}
          />
        </DemoContainer>
      </LocalizationProvider>
      <h5>Time</h5>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker', 'TimePicker']}>
          <TimePicker
            label="From"
            value={fvalue}
            onChange={(newValue) => {
              setFvalue(newValue);
              setFormData({ ...formData, start_time: newValue });
            }}
          />
          <TimePicker
            label="To"
            value={tvalue}
            onChange={(newValue) => {
              setTvalue(newValue);
              setFormData({ ...formData, end_time: newValue });
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
      <h5>Hall Name</h5>
      <select className='status' name="hall_name" value={formData.hall_name} onChange={handleChange} required>
        <option value="" disabled>Select a hall</option>
        {halls.map(hall => (
          <option key={hall.hall_name} value={hall.hall_name}>{hall.hall_name}</option>
        ))}
      </select>
      <h5>Participants</h5>
      <input type='text' name='participants' value={formData.participants} onChange={handleChange} />
      <h5>Incharge Faculty</h5>
      <input type='text' name='incharge_faculty' value={formData.incharge_faculty} onChange={handleChange} />
      <h5>Facility Needed</h5>
      <textarea style={{resize:'none'}} name='facility_needed' value={formData.facility_needed} onChange={handleChange}></textarea>
      <h5>Event Co-Ordinator Mail ID</h5>
      <input type='text' name='mail' value={formData.mailID} onChange={handleChange} />
      <div className="send-button-container">
        <button onClick={handleSubmit}>Request Hall</button>
      </div>
    </form>
  );
};

export default Hall_Request;
