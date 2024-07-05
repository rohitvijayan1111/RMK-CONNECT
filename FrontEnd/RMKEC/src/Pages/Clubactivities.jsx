import React from 'react'
import PrincipalBC from '../Components/PrincipalBC';
import PrincipalFPC from '../Components/PrincipalFPC';
import './Clubactivities.css'
const Clubactivities = () => {
  return (
    <div className="grid-containers">
      <div className="home-grid-club">
      <GridItem title="Placement">
      <PrincipalBC/>
    </GridItem>
    <GridItem title="Faculty">
      <PrincipalFPC/>
    </GridItem>
    <GridItem title="Student">
      
    </GridItem>
      </div>
    
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

export default Clubactivities