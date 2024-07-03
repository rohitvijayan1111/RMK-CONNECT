import React from 'react'
import './DashBoard.css'
import NavBar from '../Components/NavBar'
import SideBar from '../Components/SideBar'
import Navigation from '../Components/Navigation'

function DashBoard() {
  return (
    <div className='dashboard'>
        <NavBar/>
        <div className="content">
          <SideBar/>
          <Navigation/>
        </div>
        
   
    </div>
  )
}

export default DashBoard