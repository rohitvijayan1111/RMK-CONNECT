import React, { useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './Todays_List.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import withAuthorization from '../Components/WithAuthorization';

const UserGroupSelector = ({ setSelectedUserGroup }) => {
  const handleUserGroupChange = (event) => {
    const userGroup = event.target.value;
    setSelectedUserGroup(userGroup);
  };

  return (
    <div>
      <select id="userGroupSelect" className='status-yr' onChange={handleUserGroupChange} required>
        <option value="">Select User Group</option>
        <option value="Student">Student</option>
        <option value="Staff">Staff</option>
      </select>
    </div>
  );
};
const DepartmentSelector = ({ setSelectedDepartment }) => {
  const handleDepartmentChange = (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);
  };

  return (
    <div>
      <select id="departmentSelect" className='status-yr' onChange={handleDepartmentChange} required>
        <option value="">Select Department</option>
        <option value="All">All</option>
        <option value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</option>
        <option value="Civil Engineering">Civil Engineering</option>
        <option value="Computer Science and Business Systems">Computer Science and Business Systems</option>
        <option value="Computer Science and Design">Computer Science and Design</option>
        <option value="Computer Science and Engineering">Computer Science and Engineering</option>
        <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
        <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
        <option value="Electronics and Instrumentation Engineering">Electronics and Instrumentation Engineering</option>
        <option value="Information Technology">Information Technology</option>
        <option value="Mechanical Engineering">Mechanical Engineering</option>
      </select>
    </div>
  );
};

const Attendance_Log = () => {
  const [selectedUserGroup, setSelectedUserGroup] = useState('');
  const [data, setData] = useState([]);
  const [attributeNames, setAttributeNames] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const user=window.localStorage.getItem('userType');
  const notifyFailure = (error) => {
    const errorMessage = error.response?.data?.error || 'Error fetching data';
    toast.error(errorMessage, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Zoom,
    });
  };

  const fetchData = async () => {
    try {
      const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : null;
      const departmentToFetch = user === 'hod' ? window.localStorage.getItem('department') : selectedDepartment;
      console.log('Fetching data with department:', departmentToFetch);
      const response = await axios.post('http://localhost:3000/attendance/fetchtoday', {
        selectedUserGroup,
        date:formattedDate,
        department: departmentToFetch
      });console.log('Response data:', response.data);
      setData(response.data.data);
      if (response.data.data && response.data.data.length > 0) {
        const keys = extractAttributeNames(response.data.data[0]);
        setAttributeNames(keys);
      } else {
        setAttributeNames([]);
      }
    } catch (error) {
      notifyFailure(error);
      console.error('Error fetching data:', error);
    }
  };

  const extractAttributeNames = (object) => {
    return Object.keys(object);
  };

  const handleFetchClick = () => {
    setData([]);
    setAttributeNames([]);
    fetchData();
  };

  return (
    <div className='hon'>
      <div>
        <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />
        {(user!=='hod' && user!=="Attendance Manager")&& <DepartmentSelector setSelectedDepartment={setSelectedDepartment} />}
      </div>
      <div className='conte'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <input type='submit' value="Fetch" className='btm' onClick={handleFetchClick} />
      </div>
      {data.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S.No</th>
              {attributeNames.map((attribute, index) => (
                <th key={index}>{attribute}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {attributeNames.map((attribute, idx) => (
                  <td key={idx}>{item[attribute]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <ToastContainer />
    </div>
  );
};

export default withAuthorization(['hod','Principal','VC','Dean','Attendance Manager'])(Attendance_Log);
