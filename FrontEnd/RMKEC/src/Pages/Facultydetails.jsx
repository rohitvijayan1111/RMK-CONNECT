import React from 'react'
import './Facultydetails.css'
import BarCharts from '../Components/BarCharts';


const Facultydetails = () => {
  return (
    <div className="grid-container">
        <GridItem title="Bar Chart">
          <BarCharts/>
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
export default Facultydetails