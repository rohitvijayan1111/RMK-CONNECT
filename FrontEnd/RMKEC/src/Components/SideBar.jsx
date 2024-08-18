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
import Available from '../assets/Available.png';
import others from '../assets/others.png';

function SideBar() {
  const location = useLocation();
  const sidebarRef = useRef(null);

  const [showAttendanceLinks, setShowAttendanceLinks] = useState(false);
  const [showHallBookingLinks, setShowHallBookingLinks] = useState(false);

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  const isParentActive = (childPaths) => {
    return childPaths.some(path => location.pathname.startsWith(path));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
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
    setShowAttendanceLinks(false);
    setShowHallBookingLinks(false);
  }, [location]);

  const handleMouseEnterAttendanceLinks = () => {
    setShowAttendanceLinks(true);
  };

  const handleMouseLeaveAttendanceLinks = () => {
    setShowAttendanceLinks(false);
  };

  const handleMouseEnterHallBookingLinks = () => {
    setShowHallBookingLinks(true);
  };

  const handleMouseLeaveHallBookingLinks = () => {
    setShowHallBookingLinks(false);
  };

  return (
    <div className="sidebar" ref={sidebarRef}>
      <ul>
        <li className={isActive('/dashboard', true)}>
          <Link to="/dashboard">
            <img src={dashboard} width="40px" height="40px" alt="Dashboard" />
            Dashboard
          </Link>
        </li>
        <li className={`attendance_icon ${isParentActive([
          '/dashboard/Attendance_DB_Dept',
          '/dashboard/Todays-List',
          '/dashboard/Attendance-Log',
          '/dashboard/Attendance-Analysis'
        ]) ? 'active' : ''}`} onMouseEnter={handleMouseEnterAttendanceLinks} onMouseLeave={handleMouseLeaveAttendanceLinks}>
          <p>
            <img src={att} width="40px" height="40px" alt="Attendance" />
            Attendance
          </p>
          {showAttendanceLinks && (
            <div className="extra-links-container-att" onMouseEnter={handleMouseEnterAttendanceLinks} onMouseLeave={handleMouseLeaveAttendanceLinks}>
              <li>
                <Link to="/dashboard/Attendance_DB_Dept">
                  <img src={statistics} width="30px" height="30px" alt="Statistics" />
                  Statistics
                </Link>
              </li>
              <li>
                <Link to="/dashboard/Todays-List">
                  <img src={today} width="30px" height="30px" alt="Absentees" />
                  Absentees
                </Link>
              </li>
              <li>
                <Link to="/dashboard/Attendance-Log">
                  <img src={past} width="30px" height="30px" alt="Lecture" />
                  Lecture
                </Link>
              </li>
              <li>
                <Link to="/dashboard/Attendance-Analysis">
                  <img src={analysis} width="30px" height="30px" alt="Analysis" />
                  Analysis
                </Link>
              </li>
            </div>
          )}
        </li>
        <li className={`attendance_icon ${isParentActive([
          '/dashboard/DashBoard-Hall',
          '/dashboard/Request-Status',
          '/dashboard/Past-Events',
          '/dashboard/Available-Halls'
        ]) ? 'active' : ''}`} onMouseEnter={handleMouseEnterHallBookingLinks} onMouseLeave={handleMouseLeaveHallBookingLinks}>
          <p>
            <img src={reserve} width="40px" height="40px" alt="Hall Booking" />
            Hall Booking
          </p>
          {showHallBookingLinks && (
            <div className="extra-links-container" onMouseEnter={handleMouseEnterHallBookingLinks} onMouseLeave={handleMouseLeaveHallBookingLinks}>
              <li>
                <Link to="/dashboard/DashBoard-Hall">
                  <img src={upcoming} width="30px" height="30px" alt="Upcoming" />
                  Upcoming
                </Link>
              </li>
              <li>
                <Link to="/dashboard/Request-Status">
                  <img src={Status} width="30px" height="30px" alt="Request Status" />
                  Req Status
                </Link>
              </li>
              <li>
                <Link to="/dashboard/Past-Events">
                  <img src={past} width="30px" height="30px" alt="Past Events" />
                  Past Events
                </Link>
              </li>
              <li>
                <Link to="/dashboard/Available-Halls">
                  <img src={Available} width="30px" height="30px" alt="Available Halls" />
                  Halls
                </Link>
              </li>
            </div>
          )}
        </li>
        <li className={isActive('/dashboard/faculty-details')}>
          <Link to="/dashboard/faculty-details">
            <img src={faculty} width="40px" height="40px" alt="Faculty Details" />
            Faculty Details
          </Link>
        </li>
        <li className={isActive('/dashboard/mail')}>
          <Link to="/dashboard/mail">
            <img src={mail} width="40px" height="40px" alt="Mail" />
            Mail
          </Link>
        </li>
        <li className={isActive('/dashboard/forms')}>
          <Link to="/dashboard/forms">
            <img src={others} width="40px" height="40px" alt="Other Forms" />
            Other Forms
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
