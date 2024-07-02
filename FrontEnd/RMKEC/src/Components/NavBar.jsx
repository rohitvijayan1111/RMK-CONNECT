import React from 'react'
import './NavBar.css'
import logo from '../assets/RMK.png'
import logout from '../assets/logout.png'

function NavBar() {
  const handleLogout = () => {
    window.localStorage.setItem('loggedIn', false);
    window.localStorage.removeItem('userType');
    window.location.href = '/'; // Redirect to home or login page after logout
  }

  return (
    <header className='header'>
      <nav className='left'>
        <img src={logo} width="50px" height="70px" alt="Logo" />
        <a href='/' className='logo' style={{ textDecoration: 'none' }}>R.M.K. Engineering College</a>
      </nav>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </header>
  )
}

export default NavBar
