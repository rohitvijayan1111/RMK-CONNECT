import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import './Todays_List.css';
import './Attendance_Analysis.css';
import withAuthorization from '../Components/WithAuthorization';

const UserGroupSelector = ({ setSelectedUserGroup }) => {
  const [selectedUserGroup, setSelectedUserGroupState] = useState('Student');

  const handleUserGroupChange = (event) => {
    const userGroup = event.target.value;
    setSelectedUserGroupState(userGroup);
    setSelectedUserGroup(userGroup);
  };

  return (
    <div>
      <select id="userGroupSelect" className='status-yr' onChange={handleUserGroupChange} value={selectedUserGroup} required>
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

const Attendance_Analysis = () => {
  const [selectedUserGroup, setSelectedUserGroup] = useState('Student');
  const [data, setData] = useState([]);
  const [attributeNames, setAttributeNames] = useState([]);
  const [rollNumber, setRollNumber] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const user = window.localStorage.getItem('userType');
  const [name, setName] = useState('');

  const fetchData = async () => {
    try {
      const departmentToFetch = (user === 'hod' || user === 'Attendance Manager') ? window.localStorage.getItem('department') : selectedDepartment;
      const response = await axios.post('http://localhost:3000/attendance/getindividual', {
        userGroup: selectedUserGroup,
        rollnumber: rollNumber,
        department: departmentToFetch
      });

      setData(response.data);
      if (response.data.length > 0) {
        const keys = Object.keys(response.data[0]).filter(key => key !== 'id' && (selectedUserGroup === 'Student' ? key !== 'staff_id' : key !== 'student_id'));
        setAttributeNames(keys);
      } else {
        setName("No Absentees On That Day");
        setAttributeNames([]);
      }
    } catch (error) {
      setName(error.response?.data?.error || 'Error fetching data');
      console.error('Error fetching data:', error);
    }
  };

  const handleFetchClick = () => {
    setData([]);
    setName("");
    setAttributeNames([]);
    fetchData();
  };

  const handleRollNumberChange = (event) => {
    setRollNumber(event.target.value);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  useEffect(() => {
    // Reset data and name when the selected department or user group changes
    setData([]);
    setName("");
  }, [selectedDepartment, selectedUserGroup]);

  return (
    <div>
      <div>
        <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />
        {(user !== 'hod' && user !== 'Attendance Manager') && <DepartmentSelector setSelectedDepartment={setSelectedDepartment} />}
      </div>
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
      {name && <h1>{name}</h1>}
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
                  <td key={idx}>
                    {attribute.toLowerCase().includes('date')
                      ? formatDate(item[attribute])
                      : item[attribute]}
                  </td>
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

export default withAuthorization(['hod', 'Principal', 'VC', 'Dean', 'Attendance Manager'])(Attendance_Analysis);
