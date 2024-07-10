import React, { useState } from 'react';
import axios from 'axios';
import './Todays_List.css'

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
const Todays_List = () => {
  const [selectedUserGroup, setSelectedUserGroup] = useState('');
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  
  const handleYearGroupSelect = (yearGroup) => {
    setSelectedYearGroup(yearGroup);
  };
  return (
    <div>
      <div>
      <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />
      </div>
    </div>
  )
}

export default Todays_List