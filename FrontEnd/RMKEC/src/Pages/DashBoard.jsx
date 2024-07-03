import React from 'react'
import './DashBoard.css'
import BarCharts from '../Components/PlacementBarGraph';
import PieChartComponent from '../Components/FacultyCountPieChart';
import StudentCountPieChart from '../Components/StudentsCountPieChart';

function DashBoard() {
  return (
    <div className="grid-container">
        <GridItem title="Placement">
          <BarCharts/>
        </GridItem>
        <GridItem title="Faculty">
          <PieChartComponent/>
        </GridItem>
        <GridItem title="Student">
          <StudentCountPieChart/>
        </GridItem>
      </div>
  )
}
function GridItem({ title, children }) {
  return (
    <div className="grid-item">
      <h3 className="grid-item-title">{title}</h3>
      {children}
    </div>
  );
}
export default DashBoard