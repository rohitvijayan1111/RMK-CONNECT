import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Edit_Entry.css';

const UserGroupSelector = ({ setSelectedUserGroup }) => {
  const handleUserGroupChange = (event) => {
    const userGroup = event.target.value;
    setSelectedUserGroup(userGroup);
  };

  return (
    <div>
      <select id="userGroupSelect" className='status-yr' onChange={handleUserGroupChange} required defaultValue="">
        <option value="">Select User Group</option>
        <option value="Student">Student</option>
        <option value="Staff">Staff</option>
      </select>
    </div>
  );
};

const Edit_Entry = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  const [selectedUserGroup, setSelectedUserGroup] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  const notifysuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

  const notifyfailure = (error) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserGroup) {
      notifyfailure("Select User Group Type");
      return;
    }

    if (!rollNumber) {
      notifyfailure("Enter Roll/Enrollment Number");
      return;
    }

    let payload = {
      date: formattedDate,
      rollnumber: rollNumber,
      department_name :window.localStorage.getItem('department'),
      userGroup: selectedUserGroup
    };

    try {
      const response = await axios.post("http://localhost:3000/attendance/removeabsent", payload);
      console.log(response.data);
      if (response.data.error) {
        notifyfailure(response.data.error);
      } else {
        notifysuccess(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        notifyfailure('Record not found');
      }
       else {
        notifyfailure('Error removing record: ' + error.message);
      }
    }
  };

  const handleRollNumberChange = (e) => {
    setRollNumber(e.target.value);
  };

  return (
    <div>
      <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />
      <div className="faculty">
        <h1>Edit Attendance</h1>
        <h4>{formattedDate}</h4>
        <form className='edit-att'>
          <label>{(selectedUserGroup === 'Student') ? "Roll Number" : "Enrollment Number"}</label>
          <input type='number' name='rollNumber' value={rollNumber} onChange={handleRollNumberChange} required />
          <div className="bttcnt">
            <button onClick={handleSubmit} className='gh'>Mark as Present</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Edit_Entry;
