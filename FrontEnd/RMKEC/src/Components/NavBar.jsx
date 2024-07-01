import React from 'react'
import './NavBar.css'
import logo from '../assets/RMK.png'
import logout from '../assets/logout.png'
function NavBar() {
  return (
    <div>
        <header className='header'>
          <nav className='left'>
            <img src={logo} width="50px" height="70px"/>
            <a href='/' className='logo' style={{ textDecoration: 'none' }}>R.M.K. Engineering College</a>
          </nav>
            
          <button className="logout-button">Logout</button>
        </header>
    </div>
  )
}

export default NavBar