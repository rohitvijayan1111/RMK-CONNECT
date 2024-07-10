import React,{useState} from 'react'
import './Attendance_DB_Dept.css'
import PlacementBarGraph from '../Components/Department-Component/PlacementBarGraph';
import LineCharts from './LineCharts';
import Attendance_BC from './Attendance_BC';

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

function Attendance_DB_Dept() {
    const [selectedYearGroup, setSelectedYearGroup] = useState('');

    const handleYearGroupSelect = (yearGroup) => {
      setSelectedYearGroup(yearGroup);
  
    return (
      
      <div>
        <select id="batchSelect" className='status-yr' value={selectedBatch} onChange={handleBatchChange}>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
        </select>
      </div>
    );
  };

  return (
    <div>
        <BatchSelector setSelectedYearGroup={handleYearGroupSelect} />     
        <div className='home-grid-db'>
            <div className="grid-containers">
            <div className='home-grid-db'>
            <GridItem title="Attendance">
                <Attendance_BC/>
            </GridItem>
            <GridItem title="Data">
                <div className='content-container'>
                    <p>Total No of students : 300</p>
                    <p>Present              :270</p>
                    <p>Absent               :30</p>
                    <p>Total No of Teachers :20</p>
                    <p>Present              :16</p>
                    <p>Absent               :4</p>                    
                </div>                
            </GridItem>
            <GridItem title="Analysis">
            <LineCharts/>
            </GridItem>
            </div>
        </div>
        </div>
    </div>
  )
}
function GridItem({ title, children }) {
    return (
      <div className="grid-item-db">
        <h3 className="grid-item-db-title">{title}</h3>
        {children}
      </div>
    );
  }

export default Attendance_DB_Dept