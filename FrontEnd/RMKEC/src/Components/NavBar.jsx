import React from 'react'
import './NavBar.css'
import logo from '../assets/RMK.png'
import logout from '../assets/logout.png'

function NavBar() {
  const handleLogout = () => {
    window.localStorage.setItem('loggedIn', false);
    window.localStorage.removeItem('userType');
    window.location.href = '/';
  }
  function capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return (
      <header className='header'>
      <nav className='left'>
        <img src={logo} width="50px" height="70px" alt="Logo" />
        <a href='/dashboard' className='logo' style={{ textDecoration: 'none' }}>R.M.K. Engineering College</a>
      </nav>
      <div className='alig'>
        <h5>{capitalizeWords(window.localStorage.getItem('department'))}</h5>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
    </header>    
  )
}

export default NavBar
