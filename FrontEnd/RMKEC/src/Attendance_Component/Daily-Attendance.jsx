import React, { useState } from 'react';
import './Daily-Attendance.css';

const BatchDropdown = ({ onBatchSelect }) => {
  const [selectedBatch, setSelectedBatch] = useState('');

  const handleBatchChange = (event) => {
    const batch = event.target.value;
    setSelectedBatch(batch);
    onBatchSelect(batch);
  };

  return (
    <div>
      <select id="batchSelect" className='status' value={selectedBatch} onChange={handleBatchChange}>
        <option value="" disabled>Status</option>
        <option value="Informed">Informed</option>
        <option value="Un-Informed">Un-Informed</option>
      </select>
    </div>
  );
};

const BatchSelector = ({ onBatchSelect }) => {
  const [selectedBatch, setSelectedBatch] = useState('');

  const handleBatchChange = (event) => {
    const batch = event.target.value;
    setSelectedBatch(batch);
    onBatchSelect(batch);
  };

  return (
    <div>
      <select id="batchSelect" className='status-yr' value={selectedBatch} onChange={handleBatchChange}>
      <option value="Student">Student</option>
      <option value="Faculty">Faculty</option>
      </select>
    </div>
  );
};

const Daily_Attendance = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const [selectedBatch, setSelectedBatch] = useState('');

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
  };

  const [selectedYearGroup, setSelectedYearGroup] = useState('');

  const handleYearGroupSelect = (yearGroup) => {
    setSelectedYearGroup(yearGroup);
  };
  
  return (
    <div>
      <div>
      <BatchSelector setSelectedYearGroup={handleYearGroupSelect} />
      </div>
      <div className='attendance'>
        <h1>Attendance</h1>
        <h4>{formattedDate}</h4>
        <form>
          <label>Roll Number</label>
          <input type='number' required />
          <label>Reason</label>
          <input type='text' required/>
          <BatchDropdown onBatchSelect={handleBatchSelect} required />
          <div className="bttcnt">
          <button className='gh' >Absent</button>
          </div>
        </form>
    </div>
    </div>
  );
};

export default Daily_Attendance;
