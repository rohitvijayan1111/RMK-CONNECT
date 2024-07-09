import React from 'react'
import './Facultydetails.css'

const Facultydetails = () => {

  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  return (
    <div className="faculty">
        <h2>Edit Attendance</h2>
        <h4>{formattedDate}</h4>
        <form className='edit-att'>
      
          <label>Roll Number</label>
          <input type='number' required />          
          <div className="bttcnt">
          <button className='hg' >Mark as Present</button>
          </div>
        
        </form>
      </div>
  )
}

export default Facultydetails