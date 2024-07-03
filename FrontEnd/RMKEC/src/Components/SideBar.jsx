import React from 'react';
import './SideBar.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import club from '../assets/club.png';
import lecture from '../assets/lecture.png';
import faculty from '../assets/faculty.png';
import course from '../assets/course.png';
import sports from '../assets/sports.png';
import achievements from '../assets/achievements.png';
import dashboard from '../assets/dashboard.png';

function SideBar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="">
            <img src={dashboard} width="40px" height="40px" alt="Dashboard" />
            DashBoard
          </Link>
        </li>
        <li>
          <Link to="club-activity">
            <img src={club} width="40px" height="40px" alt="Club Activity" />
            Club Activity
          </Link>
        </li>
        <li>
          <Link to="guest-lecture">
            <img src={lecture} width="40px" height="40px" alt="Guest Lecture" />
            Guest Lecture
          </Link>
        </li>
        <li>
          <Link to="faculty-details">
            <img src={faculty} width="40px" height="40px" alt="Faculty Details" />
            Faculty Details
          </Link>
        </li>
        <li>
          <Link to="course-coverage">
            <img src={course} width="40px" height="40px" alt="Course Coverage" />
            Course Coverage
          </Link>
        </li>
        <li>
          <Link to="sports">
            <img src={sports} width="40px" height="40px" alt="Sports" />
            Sports
          </Link>
        </li>
        <li>
          <Link to="achievements">
            <img src={achievements} width="40px" height="40px" alt="Achievements" />
            Achievements
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
