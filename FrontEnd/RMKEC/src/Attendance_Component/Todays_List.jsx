import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './Todays_List.css';
import withAuthorization from '../Components/WithAuthorization';
import dayjs from 'dayjs';
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

const Todays_List = () => {
  const [selectedUserGroup, setSelectedUserGroup] = useState('Student');
  const [data, setData] = useState([]);
  const [attributeNames, setAttributeNames] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [name, setName] = useState('');
  const user = window.localStorage.getItem('userType');
  const todayDate = dayjs().format('DD-MM-YYYY');
  useEffect(() => {
    if (selectedUserGroup) {
      setData([]);
      setAttributeNames([]);
      fetchData();
    }
  }, [selectedUserGroup, selectedDepartment]);

  const fetchData = async () => {
    try {
      const departmentToFetch = (user === 'hod' || user === 'Attendance Manager') ? window.localStorage.getItem('department') : selectedDepartment;
      console.log('Fetching data with department:', departmentToFetch);

      const response = await axios.post('http://localhost:3000/attendance/fetchtoday', {
        selectedUserGroup,
        department: departmentToFetch,
      });

      console.log('Response data:', response.data);
      setData(response.data.data);
      if (response.data.data && response.data.data.length > 0) {
        const keys = extractAttributeNames(response.data.data[0]);
        setAttributeNames(keys);
        setName('');  
      } else {
        setName("No Absenties Today");
        setAttributeNames([]);
      }
    } catch (error) {
      setName(error.response?.data?.error);
      console.error('Error fetching data:', error);
    }
  };

  const extractAttributeNames = (object) => {
    return Object.keys(object);
  };

  return (
    <div>
      <h1>{todayDate}</h1>
      <div className='holder'>
        <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />
        {(user !== 'hod' && user !== 'Attendance Manager') && (
          <DepartmentSelector setSelectedDepartment={setSelectedDepartment} />
        )}
      </div>
      {name && <h1>{name}</h1>}
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
      <ToastContainer transition={Zoom} />
    </div>
  );
};

export default withAuthorization(['hod', 'Principal', 'VC', 'Dean', 'Attendance Manager'])(Todays_List);
