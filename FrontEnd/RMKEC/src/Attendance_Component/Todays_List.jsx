import React,{useState} from 'react'


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
const Todays_List = () => {
  const [selectedYearGroup, setSelectedYearGroup] = useState('');

  const handleYearGroupSelect = (yearGroup) => {
    setSelectedYearGroup(yearGroup);
  };
  return (
    <div>
      <div>
        <BatchSelector setSelectedYearGroup={handleYearGroupSelect} />
      </div>
    </div>
  )
}

export default Todays_List