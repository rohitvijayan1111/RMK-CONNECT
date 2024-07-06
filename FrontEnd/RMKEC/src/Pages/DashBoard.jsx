import React from 'react'
import DashBoard_hod from './Dashboard_hod';
import Dashboard_admin from './Dashboard_admin';

const DashBoard = () => {
  const role=window.localStorage.getItem('userType');
  return (
    (role==='hod')?<DashBoard_hod/>:<Dashboard_admin/>
  )
}

export default DashBoard