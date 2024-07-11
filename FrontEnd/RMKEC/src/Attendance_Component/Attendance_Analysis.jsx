import React, { useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './Todays_List.css';
import './Attendance_Analysis.css';
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

const Attendance_Analysis = () => {
  const [selectedUserGroup, setSelectedUserGroup] = useState('');
  const [data, setData] = useState([]);
  const [attributeNames, setAttributeNames] = useState([]);
  const [rollNumber, setRollNumber] = useState('');

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
      const response = await axios.post('http://localhost:3000/attendance/getindividual', {
        userGroup: selectedUserGroup,
        rollnumber: rollNumber
      });

      setData(response.data); 
      if (response.data.length > 0) {
        const keys = Object.keys(response.data[0]).filter(key => key !== 'id' && (selectedUserGroup === 'Student' ? key !== 'staff_id' : key !== 'student_id'));
        setAttributeNames(keys);
      } else {
        setAttributeNames([]);
      }
    } catch (error) {
      notifyFailure(error);
      console.error('Error fetching data:', error);
    }
  };

  const handleFetchClick = () => {
    setData([]);
    setAttributeNames([]);
    fetchData();
  };

  const handleRollNumberChange = (event) => {
    setRollNumber(event.target.value);
  };

  return (
    <div className='container'>
      <h1>Attendance Analysis</h1>
      <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />
      <div className='bb'>
        <form className='aa'>
          <input
            type='number'
            placeholder='Enter Roll Number'
            value={rollNumber}
            onChange={handleRollNumberChange}
          />
        </form>
        <input type='submit' className='bmt' value="Fetch" onClick={handleFetchClick} />
      </div>
      {data.length > 0 && attributeNames.length > 0 && (
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

export default withAuthorization(['hod','Principal','VC','Dean','Attendance Manager'])(Attendance_Analysis);
