import React from 'react';
import './DepartmentList.css'; 

const DepartmentList = () => {

  const departments = [
    { code: 'AD', name: 'Artificial Intelligence and Data Science' },
    { code: 'CB', name: 'COMPUTER SCIENCE AND BUSSINESS SYSTEM' },
    { code: 'CD', name: 'COMPUTER SCIENCE AND DESIGN' },
    { code: 'CE', name: 'Civil Engineering' },
    { code: 'CS', name: 'Computer Science and Engineering' },
    { code: 'EC', name: 'Electronics and Communication Engineering' },
    { code: 'EE', name: 'Electrical and Electronics Engineering' },
    { code: 'EI', name: 'Electronics and Instrumentation Engineering' },
    { code: 'IT', name: 'Information Technology' },
    { code: 'ME', name: 'Mechanical Engineering' },
  ];

  return (
    <div className="department-list">
      <h2>Department Codes and Names</h2>
      <div className="departments-container">
        {departments.map(dept => (
          <div key={dept.code} className="department-item">
            <span className="dept-code">{dept.code}</span>
            <span className="dept-name">{dept.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentList;
