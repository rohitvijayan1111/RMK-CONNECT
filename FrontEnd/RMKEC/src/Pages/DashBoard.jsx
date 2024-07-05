import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './DashBoard.css';
import PieChartComponent from '../Components/FacultyCountPieChart';
import StudentCountPieChart from '../Components/StudentsCountPieChart';
import PlacementBarGraph from '../Components/PlacementBarGraph';

function DashBoard() {
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [studentDetails, setStudentDetails] = useState([]);
  const [facultyDetails,setfacultyDetails]=useState([]);
  const [studentYrsDetails,setStudentYrsDetails]=useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post("http://localhost:3000/graphs/academicyear");
        const years = response.data;
        setAcademicYears(years);
        const defaultYear = years[years.length - 1];
        setSelectedYear(defaultYear);
        fetchStudentData(defaultYear);
        fetchStaffData();
        fetchStudentyrsData();
      } catch (error) {
        console.error('Error fetching academic years:', error);
      }
    }

    fetchData();
  }, []);

  
  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    fetchStudentData(year);
    fetchStudentyrsData();
  };
  const fetchStudentData = async (year) => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/studentsgraph", { dept: "IT", academic_year: year });
      setStudentDetails(transformData(response.data));
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };
  const transformData = (data) => {
    return [
      { status: 'Placed', students: data.placed_students },
      { status: 'Yet to be Placed', students: data.yet_placed_students },
      { status: 'HS', students: data.higher_studies_students },
    ];
  };
  const fetchStaffData = async () => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/staffgraph", { dept: "IT" });
      const transformedData = transformstaffData(response.data);
      console.log('Transformed Staff Data:', transformedData); // Add this line
      setfacultyDetails(transformedData);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };
  
  const transformstaffData = (data) => {
    return [
      { name: "PG Staff", value: data.PG_Staff },
      { name: "Pursuing PG", value: data.Pursuing_PG },
      { name: "Asst. Prof", value: data.Asst_Prof },
      { name: "Non-Technical", value: data.Non_Technical },
    ];
  };
  const fetchStudentyrsData = async () => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/studentsyrsgraph", { dept: "IT"});
      setStudentYrsDetails(transformyrsData(response.data));
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };
  
  const transformyrsData = (data) => {
    return [
      { name: "1st Year", value: data.firstyear },
      { name: "2nd Year", value: data.secondyear },
      { name: "3rd Year", value: data.thirdyear },
      { name: "4th Year", value: data.fourthyear }
    ];;
  };
  
  return (
    <div>
      <select value={selectedYear} onChange={handleYearChange}>
        {academicYears.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </select>
      <div className="grid-container">
        <div className='home-grid'>
        <GridItem title="Faculty">
          <PieChartComponent data={facultyDetails} />
        </GridItem>
        <GridItem title="Placement">
          <PlacementBarGraph Details={studentDetails} />
        </GridItem>
        <GridItem title="Student">
          <StudentCountPieChart data={studentYrsDetails}/>
        </GridItem>
        </div>
        
      </div>
    </div>
  );
}

function GridItem({ title, children }) {
  return (
    <div className="grid-item">
      <h3 className="grid-item-title">{title}</h3>
      {children}
    </div>
  );
}

export default DashBoard;