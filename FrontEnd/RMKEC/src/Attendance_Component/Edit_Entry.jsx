import React,{useState} from 'react'
import './Edit_Entry.css'



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
        <option value="2022-2026">2022-2026</option>
        <option value="2023-2027">2023-2027</option>
        <option value="2024-2028">2024-2028</option>
        <option value="2025-2029">2025-2029</option>
      </select>
    </div>
  );
};

const Edit_Entry = () => {

  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

    const [selectedYearGroup, setSelectedYearGroup] = useState('');

    const handleYearGroupSelect = (yearGroup) => {
      setSelectedYearGroup(yearGroup);
  
    return (
      
      <div>
        <select id="batchSelect" className='status-yr' value={selectedBatch} onChange={handleBatchChange}>
          <option value="2022-2026">2022-2026</option>
          <option value="2023-2027">2023-2027</option>
          <option value="2024-2028">2024-2028</option>
          <option value="2025-2029">2025-2029</option>
        </select>
      </div>
    );
  };
  
  return (
    <div>
      <BatchSelector setSelectedYearGroup={handleYearGroupSelect} />
        <div className="faculty">
        <h1>Edit Attendance</h1>
        <h4>{formattedDate}</h4>
        <form className='edit-att'>
      
          <label>Roll Number</label>
          <input type='number' required />          
          <div className="bttcnt">
          <button className='hg' >Mark as Present</button>
          </div>
        
        </form>
      </div>
    </div>
  )
}

export default Edit_Entry;