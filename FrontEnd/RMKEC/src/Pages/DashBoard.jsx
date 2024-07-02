import React from 'react'
import './DashBoard.css'
import NavBar from '../Components/NavBar'
import SideBar from '../Components/SideBar'

function DashBoard() {
  return (
    <div className='dashboard'>
        <NavBar/>
        <SideBar/>
   
    </div>
  )
}

export default DashBoard