import React from 'react'
import './SideBar.css'
import club from '../assets/club.png'
import lecture from '../assets/lecture.png'
import faculty from '../assets/faculty.png'
import course from '../assets/course.png'
import sports from '../assets/sports.png'
import achievements from '../assets/achievements.png'
import dashboard from '../assets/dashboard.png'
function SideBar() {
  return (
    <div className="sidebar">
        <ul>
        <li>
          <a href="#">
            <img src={dashboard} width="40px"  height="40px" />
            DashBoard
          </a>
        </li>
        <li>
          <a href="#">
            <img src={club} width="40px"  height="40px" />
            Club Activity
          </a>
        </li>
        <li>
          <a href="#">
          <img src={lecture} width="40px"  height="40px" />
            Guest Lecture
          </a>
        </li>
        <li>
          <a href="#">
          <img src={faculty} width="40px"  height="40px" />
           Faculty Details
          </a>
        </li>
        <li>
          <a href="#">
          <img src={course} width="40px"  height="40px" />
           Course Coverage
          </a>
        </li>
        <li>
          <a href="#">
          <img src={sports} width="40px"  height="40px" />
           Sports
          </a>
        </li>
        <li>
          <a href="#">
          <img src={achievements} width="40px"  height="40px" />
           Achievements
          </a>
        </li>
      </ul>
    </div>
  )
}

export default SideBar