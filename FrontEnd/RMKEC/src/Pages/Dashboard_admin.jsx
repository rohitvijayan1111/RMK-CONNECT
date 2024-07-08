import React, { useState, useEffect } from 'react';
import PrincipalBC from '../Components/Admin-Component/PrincipalBC';
import axios from 'axios';
import PrincipalFPC from '../Components/Admin-Component/PrincipalFPC';
import './Dashboard_admin.css';
import PrincipalSPC from '../Components/Admin-Component/PrincipalSPC';

const Dashboard_admin = () => {
  const [adminacademicYears, setadminAcademicYears] = useState([]);
  const [adminselectedYear, setadminSelectedYear] = useState('');
  const [adminstudentDetails, setadminStudentDetails] = useState([]);
  const [adminfacultyDetails, setadminFacultyDetails] = useState([]);
  const [adminstudentYrsDetails, setadminStudentYrsDetails] = useState([]);
  const [adminshowGraphs, setadminShowGraphs] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post("http://localhost:3000/graphs/academicyear");
        const years = response.data;
        setadminAcademicYears(years);
        const defaultYear = years[years.length - 1];
        setadminSelectedYear(defaultYear);
        fetchadminStudentData(defaultYear);
        fetchadminStaffData();
        fetchadminStudentyrsData();
      } catch (error) {
        console.error('Error fetching academic years:', error);
      }
    }

    fetchData();

    return () => {
      setadminAcademicYears([]);
      setadminSelectedYear('');
      setadminStudentDetails([]);
      setadminFacultyDetails([]);
      setadminStudentYrsDetails([]);
      setadminShowGraphs(false);
    };
  }, []);

  useEffect(() => {
    setadminShowGraphs(true);
  }, [adminselectedYear]);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setadminSelectedYear(year);
    fetchadminStudentData(year);
  };

  const fetchadminStudentData = async (year) => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/adminstudentsgraph", { academic_year: year });
      setadminStudentDetails(transformData(response.data));
      
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };
  const departmentMapping = {
    'Artificial Intelligence and Data Science': 'AI',
    'Civil Engineering': 'CE',
    'Computer Science and Business Systems': 'CSB',
    'Computer Science and Design': 'CSD',
    'Computer Science and Engineering': 'CSE',
    'Electrical and Electronics Engineering': 'EE',
    'Electronics and Communication Engineering': 'ECE',
    'Electronics and Instrumentation Engineering': 'EIE',
    'Information Technology': 'IT',
    'Mechanical Engineering': 'ME',
  };
  const transformData = (data) => {
    return data.map((item) => ({
      name: departmentMapping[item.department] || item.department, 
      Placed: item.placed_students,
      NotPlaced: item.yet_placed_students,
      HS: item.higher_studies_students,
    }));
    
  };
  const fetchadminStaffData = async () => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/adminstaffgraph", {});
      console.log(response.data);
      const transformedData = transformadminstaffData(response.data);
      console.log('Transformed Staff Data:', transformedData); 
      setadminFacultyDetails(transformedData);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };
  
  const transformadminstaffData = (data) => {
    return data.map((item) => ({
      name: departmentMapping[item.department] || item.department, 
      value:item.PG_Staff+item.Pursuing_PG+item.Asst_Prof+item.Non_Technical,
      PG_Staff:item.PG_Staff ,
      Pursuing_PG:item.Pursuing_PG,
      Asst_Prof:item.Asst_Prof ,
      Non_Technical: item.Non_Technical,
    }));
  };
  const fetchadminStudentyrsData = async () => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/adminstudentsyrsgraph", {});
      setadminStudentYrsDetails(transformadminyrsData(response.data));
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };
  
  const transformadminyrsData = (data) => {
    return data.map((item) => ({
      name: departmentMapping[item.department] || item.department,
      value:item.firstyearcount+item.secondyearcount+item.thirdyearcount+item.fourthyearcount,
      First_year:item.firstyearcount,
      Second_year:item.secondyearcount,
      Third_year:item.thirdyearcount,
      Fourth_year: item.fourthyearcount,
    }));

  };

  return (
    <div>
      <select className='dropbutton' value={adminselectedYear} onChange={handleYearChange}>
        {adminacademicYears.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </select>
      <div className="grid-containers">
        <div className="home-grid-club">
          <GridItem title="Faculty">
            <PrincipalFPC data={adminfacultyDetails}/>
          </GridItem>
          <GridItem title="Placement" >
            <PrincipalBC data={adminstudentDetails}/>
            <button className="cute-button">View</button>
          </GridItem>
          <GridItem title="Student">
          <PrincipalSPC data={adminstudentYrsDetails}/>
          </GridItem>
        </div>
      </div>
    </div>
  );
};

function GridItem({ title, children }) {
  return (
    <div className="grid-item-ca">
      <h3 className="grid-item-ca-title">{title}</h3>
      {children}
    </div>
  );
}

export default Dashboard_admin;
