import React from 'react'
import PrincipalBC from '../Components/PrincipalBC';

const Clubactivities = () => {
  return (
    <div className="grid-container">
    <GridItem title="Placement">
      <PrincipalBC/>
    </GridItem>
    <GridItem title="Faculty">
      
    </GridItem>
    <GridItem title="Student">
      
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

export default Clubactivities