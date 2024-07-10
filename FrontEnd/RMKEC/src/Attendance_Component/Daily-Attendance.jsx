import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Daily-Attendance.css';

const LeaveTypeDropdown = ({ onLeaveTypeSelect }) => {
  const handleLeaveTypeChange = (event) => {
    const leaveType = event.target.value;
    onLeaveTypeSelect(leaveType);
  };

  return (
    <div>
      <select id="leaveTypeSelect" className='status' onChange={handleLeaveTypeChange} required>
        <option value="" default>Leave Type</option>
        <option value="Informed">Informed</option>
        <option value="Un-Informed">Un-Informed</option>
      </select>
    </div>
  );
};

const UserGroupSelector = ({ setSelectedUserGroup }) => {
  const handleUserGroupChange = (event) => {
    const userGroup = event.target.value;
    setSelectedUserGroup(userGroup);
  };

  return (
    <div>
      <select id="userGroupSelect" className='status-yr' onChange={handleUserGroupChange} required>
        <option value="" default>Select User Group</option>
        <option value="Student">Student</option>
        <option value="Staff">Staff</option>
      </select>
    </div>
  );
};

const Daily_Attendance = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [selectedUserGroup, setSelectedUserGroup] = useState('');

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
    if (!selectedLeaveType || !selectedUserGroup) {
      notifyfailure("Select Both User Group Type and Leave Type");
      return;
    }

    const rollNumber = e.target.elements.rollNumber.value;
    const reason = e.target.elements.reason.value;

    let payload = {
      reason: reason,
      leave_type: selectedLeaveType,
      attendance_date: formattedDate
    };

    if (selectedUserGroup === 'Student') {
      payload.student_id = rollNumber;
    } else {
      payload.staff_id = rollNumber;
    }

    try {
      const response = await axios.post("http://localhost:3000/attendance/addabsent", payload);
      console.log(response.data);
      if (response.data.error) {
        notifyfailure(response.data.error);
      } else {
        notifysuccess(response.data.message);
      }
    } catch (error) {
      notifyfailure('Error inserting record: ' + error.message);
    }
  };

  return (
    <div>
      <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />

      <div className='attendance'>
        <h1>Attendance</h1>
        <h4>{formattedDate}</h4>

        <form>
          <label>{(selectedUserGroup === 'Student') ? "Roll Number" : "Enrollment Number"}</label>
          <input type='number' name='rollNumber' required />
          
          <label>Reason</label>
          <input type='text' name='reason' required />

          <LeaveTypeDropdown onLeaveTypeSelect={setSelectedLeaveType} />

          <div className="bttcnt">
            <button onClick={handleSubmit} className='gh'>Absent</button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Daily_Attendance;
