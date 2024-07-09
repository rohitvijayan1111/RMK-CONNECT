import React from 'react'
import './Attendance_Analysis.css'
function Attendance_Analysis() {
  return (
    <div className='bb'>
        <form className='aa'>
            <input type='number' placeholder='Enter Roll Number'/>
        </form>
        <input type='submit' className='bmt' value="Fetch"/>
    </div>
  )
}

export default Attendance_Analysis