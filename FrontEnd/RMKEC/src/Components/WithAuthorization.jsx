// src/Components/withAuthorization.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuthorization = (allowedRoles) => (WrappedComponent) => {
  return (props) => {
    const userRole = window.localStorage.getItem("userType");
    
    if (allowedRoles.includes(userRole)) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/invalidpage" />;
    }
  };
};

export default withAuthorization;
