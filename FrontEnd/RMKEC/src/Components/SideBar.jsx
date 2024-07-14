import React, { useState, useEffect } from 'react';
import './SideBar.css';
import { Link, useLocation } from 'react-router-dom'; 
import club from '../assets/club.png';
import lecture from '../assets/lecture.png';
import faculty from '../assets/faculty.png';
import course from '../assets/course.png';
import sports from '../assets/sports.png';
import achievements from '../assets/achievements.png';
import dashboard from '../assets/dashboard.png';
import IV from '../assets/location.png';
import mail from '../assets/mail.png';
import more from '../assets/more.png';

function SideBar() {
  const location = useLocation(); 
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const [showExtraLinks, setShowExtraLinks] = useState(false);

  useEffect(() => {
    // Hide extra links when the route changes
    setShowExtraLinks(false);
  }, [location]);

  const handleToggleExtraLinks = () => {
    setShowExtraLinks(!showExtraLinks);
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
        <li className={isActive('/dashboard/iv')}>
          <Link to="/dashboard/iv">
            <img src={IV} width="40px" height="40px" alt="I V" />
            I V
          </Link>
        </li>
        <li className={isActive('/dashboard/mail')}>
          <Link to="/dashboard/mail">
            <img src={mail} width="40px" height="40px" alt="Mail" />
            Mail
          </Link>
        </li>
        <li className={isActive('/dashboard/club-activity')}>
          <Link to="/dashboard/club-activity">
            <img src={club} width="40px" height="40px" alt="Club Activity" />
            Club Activity
          </Link>
        </li>
        <li
          className={`more-button ${showExtraLinks ? 'active' : ''}`}
          onClick={handleToggleExtraLinks}
        >
          <h3>...</h3>
        </li>
        {showExtraLinks && (
          <div className="extra-links-container">
            <li className={isActive('/dashboard/guest-lecture')}>
              <Link to="/dashboard/guest-lecture">
                <img src={lecture} width="40px" height="50px" alt="Guest Lecture" />
                Guest Lecture
              </Link>
            </li>
            <li className={isActive('/dashboard/sports')}>
              <Link to="/dashboard/sports">
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
          </div>
        )}
      </ul>
    </div>
  );
}

export default SideBar;
