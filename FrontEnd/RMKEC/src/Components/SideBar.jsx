import React from 'react';
import './SideBar.css';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import club from '../assets/club.png';
import lecture from '../assets/lecture.png';
import faculty from '../assets/faculty.png';
import course from '../assets/course.png';
import sports from '../assets/sports.png';
import achievements from '../assets/achievements.png';
import dashboard from '../assets/dashboard.png';

function SideBar() {
  const location = useLocation(); // Get current location
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <ul>
        <li className={isActive('/dashboard')}>
          <Link to="/dashboard">
            <img src={dashboard} width="40px" height="40px" alt="Dashboard" />
            Dashboard
          </Link>
        </li>
        <li className={isActive('/dashboard/club-activity')}>
          <Link to="/dashboard/club-activity">
            <img src={club} width="40px" height="40px" alt="Club Activity" />
            Club Activity
          </Link>
        </li>
        <li className={isActive('/dashboard/guest-lecture')}>
          <Link to="/dashboard/guest-lecture">
            <img src={lecture} width="40px" height="40px" alt="Guest Lecture" />
            Guest Lecture
          </Link>
        </li>
        <li className={isActive('/dashboard/faculty-details')}>
          <Link to="/dashboard/faculty-details">
            <img src={faculty} width="40px" height="40px" alt="Faculty Details" />
            Faculty Details
          </Link>
        </li>
        <li className={isActive('/dashboard/course-coverage')}>
          <Link to="/dashboard/course-coverage">
            <img src={course} width="40px" height="40px" alt="Course Coverage" />
            Course Coverage
          </Link>
        </li>
        <li className={isActive('/mail')}>
          <Link to="/dashboard/mail">
            <img src={sports} width="40px" height="40px" alt="Sports" />
            Sports
          </Link>
        </li>
        <li className={isActive('/dashboard/achievements')}>
          <Link to="/dashboard/achievements">
            <img src={achievements} width="40px" height="40px" alt="Achievements" />
            Achievements
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
