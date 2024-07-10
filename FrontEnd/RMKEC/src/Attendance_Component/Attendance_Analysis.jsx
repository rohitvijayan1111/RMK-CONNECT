import React,{useState} from 'react'
import './Attendance_Analysis.css'

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
function Attendance_Analysis() {
  const [selectedYearGroup, setSelectedYearGroup] = useState('');

  const handleYearGroupSelect = (yearGroup) => {
    setSelectedYearGroup(yearGroup);
  };
  return (
    <div>
      <BatchSelector setSelectedYearGroup={handleYearGroupSelect} />
      <div className='bb'>
          <form className='aa'>
              <input type='number' placeholder='Enter Roll Number'/>
          </form>
          <input type='submit' className='bmt' value="Fetch"/>
      </div>
    </div>
  )
}

export default Attendance_Analysis