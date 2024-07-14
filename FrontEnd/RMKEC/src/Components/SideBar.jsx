import React, { useState, useEffect, useRef } from 'react';
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
import att from '../assets/Attendance.png';
import statistics from '../assets/statistics.png';
import today from '../assets/today.png';
import past from '../assets/past.png';
import analysis from '../assets/analysis.png';
import reserve from '../assets/reserve.png';
import upcoming from '../assets/upcoming.png';
import Status from '../assets/Status.png';
import Available from '../assets/Available.png'
function SideBar() {
  const location = useLocation();
  const sidebarRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const [showExtraLinks, setShowExtraLinks] = useState(false);
  const [showAttendanceLinks, setShowAttendanceLinks] = useState(false);
  const [showHallBookingLinks, setShowHallBookingLinks] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowExtraLinks(false);
        setShowAttendanceLinks(false);
        setShowHallBookingLinks(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowExtraLinks(false);
    setShowAttendanceLinks(false);
    setShowHallBookingLinks(false);
  }, [location]);

  const handleToggleExtraLinks = (event) => {
    event.stopPropagation();
    setShowExtraLinks(!showExtraLinks);
  };

  const handleToggleAttendanceLinks = (event) => {
    event.stopPropagation();
    setShowAttendanceLinks(!showAttendanceLinks);
  };

  const handleToggleHallBookingLinks = (event) => {
    event.stopPropagation();
    setShowHallBookingLinks(!showHallBookingLinks);
  };

  return (
    <div className="sidebar" ref={sidebarRef}>
      <ul>
        <li className={isActive('/dashboard')}>
          <Link to="/dashboard">
            <img src={dashboard} width="40px" height="40px" alt="Dashboard" />
            Dashboard
          </Link>
        </li>
        <li className='attendance_icon' onClick={handleToggleAttendanceLinks}>
          <p>
            <img src={att} width="40px" height="40px" alt="Attendance" />
            Attendance
          </p>
        </li>
        {showAttendanceLinks && (
          <div className="extra-links-container">
            <li className={isActive('/dashboard/Attendance_DB_Dept')}>
              <Link to="/dashboard/Attendance_DB_Dept">
                <img src={statistics} width="40px" height="40px" alt="Faculty Details" />
                Statistics
              </Link>
            </li>
            <li className={isActive('/dashboard/Todays-List')}>
              <Link to="/dashboard/Todays-List">
                <img src={today} width="40px" height="40px" alt="Today" />
                Absentees
              </Link>
            </li>
            <li className={isActive('/dashboard/Attendance-Log')}>
              <Link to="/dashboard/Attendance-Log">
                <img src={past} width="40px" height="40px" alt="Past" />
                Lecture
              </Link>
            </li>
            <li className={isActive('/dashboard/Attendance-Analysis')}>
              <Link to="/dashboard/Attendance-Analysis">
                <img src={analysis} width="40px" height="40px" alt="Analysis" />
                Analysis
              </Link>
            </li>
          </div>
        )}
        <li className='attendance_icon' onClick={handleToggleHallBookingLinks}>
          <p>
            <img src={reserve} width="40px" height="40px" alt="reserve" />
            Hall Booking
          </p>
        </li>

        {showHallBookingLinks && (
          <div className="extra-links-container">
            <li className={isActive('/dashboard/DashBoard-Hall')}>
              <Link to="/dashboard/DashBoard-Hall">
                <img src={upcoming} width="40px" height="40px" alt="upcoming" />
                Upcoming
              </Link>
            </li>
            <li className={isActive('/dashboard/Edit_Entry')}>
              <Link to="/dashboard/Request-Status">
              <img src={Status} width="40px" height="40px" alt="Request Status" />
                Request Status
              </Link>
            </li>
            <li className={isActive('/dashboard/Todays-List')}>
              <Link to="/dashboard/Past-Events">
              <img src={past} width="40px" height="40px" alt="Past Events" />
                Past Events
              </Link>
            </li>
            <li className={isActive('/dashboard/Available-Halls')}>
              <Link to="/dashboard/Available-Halls">
              <img src={Available} width="40px" height="40px" alt="Available Hall" />
                Available Halls
              </Link>
            </li>
          </div>
        )}

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

        <li className={`more-button ${showExtraLinks ? 'active' : ''}`} onClick={handleToggleExtraLinks}>
          <h3>...</h3>
        </li>
        {showExtraLinks && (
          <div className="extra-links-container">
            <li className={isActive('/dashboard/guest-lecture')}>
              <Link to="/dashboard/guest-lecture">
                <img src={lecture} width="40px" height="40px" alt="Guest Lecture" />
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
            <li className={isActive('/dashboard/club-activity')}>
              <Link to="/dashboard/club-activity">
                <img src={club} width="40px" height="40px" alt="Club Activity" />
                Club Activity
              </Link>
            </li>
          </div>
        )}
      </ul>
    </div>
  );
}

export default SideBar;
