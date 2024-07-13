import React from 'react';
import './Available_Details.css'
import hall from '../assets/hall.jpeg'
import Available_Details from './Available_Details';
const halls = [
  {
    name: 'Auditorium',
    image: hall,
    location: 'Building A, 1st Floor',
    capacity: 500,
    facilities: ['Projector', 'Sound System', 'Wi-Fi']
  },
  {
    name: 'Conference Hall',
    image: hall,
    location: 'Building B, 2nd Floor',
    capacity: 200,
    facilities: ['Video Conferencing', 'AC', 'Wi-Fi']
  },
  {
    name: 'Semoom',
    image: hall,
    location: 'Building C, Ground Floor',
    capacity: 100,
    facilities: ['Whiteboard', 'Projector', 'Wi-Fi']
  },
  {
    name: 'Semim',
    image: hall,
    location: 'Building C, Ground Floor',
    capacity: 100,
    facilities: ['Whiteboard', 'Projector', 'Wi-Fi']
  },
  {
    name: 'Ser Room',
    image: hall,
    location: 'Building C, Ground Floor',
    capacity: 100,
    facilities: ['Whiteboard', 'Projector', 'Wi-Fi']
  },
  {
    name: 'Seminar  dsdsd sd',
    image: hall,
    location: 'Building C, Ground Floor',
    capacity: 100,
    facilities: ['Whiteboard', 'Projector', 'Wi-Fi']
  },
];

function Available_Halls() {
  return (
    <div>
    <div className="krt">
      <div className="hall-details-container">
        {halls.map(hall => (
          <Available_Details key={hall.name} hall={hall} />
        ))}
      </div>
    </div>
    </div>
  );
}

export default Available_Halls;
