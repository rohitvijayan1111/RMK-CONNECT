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
        <option value="2022-2026">2022-2026</option>
        <option value="2023-2027">2023-2027</option>
        <option value="2024-2028">2024-2028</option>
        <option value="2025-2029">2025-2029</option>
      </select>
    </div>
  );
};
const Clubactivities = () => {
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

export default Clubactivities