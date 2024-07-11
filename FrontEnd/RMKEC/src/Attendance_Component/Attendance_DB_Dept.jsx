import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Attendance_DB_Dept.css';
import LineCharts from './LineCharts';
import Attendance_BC from './Attendance_BC';
import Attendance_BC_Admin from '../Components/Admin-Component/Attendance_BC_Admin';

const BatchSelector = ({ onBatchSelect }) => {
  const [selectedBatch, setSelectedBatch] = useState('Student');

  const handleBatchChange = (event) => {
    const batch = event.target.value;
    setSelectedBatch(batch);
    onBatchSelect(batch);
  };

  return (
    <div>
      <select id="batchSelect" className='status-yr' value={selectedBatch} onChange={handleBatchChange}>
        <option value="Student">Student</option>
        <option value="Faculty">Faculty</option>
      </select>
    </div>
  );
};

const GridItem = ({ title, children }) => {
  return (
    <div className="grid-item-db">
      <h3 className="grid-item-db-title">{title}</h3>
      {children}
    </div>
  );
};

export function Attendance_DB_Dept() {
  const [selectedYearGroup, setSelectedYearGroup] = useState('Student');
  const [data, setData] = useState([]);
  const [countdata, setCountData] = useState(null);
  const [linedata, setLineData] = useState([]);

  const notifyFailure = (error) => {
    toast.error(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.post("http://localhost:3000/attendance/attendance-summary", { department: window.localStorage.getItem("department") });
        console.log('Attendance summary data:', response.data);
        setData(response.data);

        const response2 = await axios.post("http://localhost:3000/attendance/attendance-count-summary", { department: window.localStorage.getItem("department"), user: selectedYearGroup });
        console.log('Attendance count summary data:', response2.data);
        setCountData(response2.data);

        const response3 = await axios.post("http://localhost:3000/attendance/attendance-graph", { department: window.localStorage.getItem("department"), user: selectedYearGroup });
        console.log('Attendance graph data:', response3.data);
        setLineData(response3.data);
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
          notifyFailure(new Error(error.response.data.error || 'Server Error'));
        } else if (error.request) {
          console.error('Network Error:', error.request);
          notifyFailure(new Error('Network Error'));
        } else {
          console.error('Request Error:', error.message);
          notifyFailure(new Error('Request Error'));
        }
      }
    }
    getData();
  }, [selectedYearGroup]);

  const handleYearGroupSelect = (yearGroup) => {
    setSelectedYearGroup(yearGroup);
    setLineData([]);
  };

  return (
    <div>
      <BatchSelector onBatchSelect={handleYearGroupSelect} />
      <div className='home-grid-db'>
        <div className="grid-containers">
          <div className='home-grid-db'>
            <GridItem title="Attendance">
              <Attendance_BC data={data} />
            </GridItem>
            <GridItem title="Data">
              <div className='content-container'>
                {countdata !== null && (
                  <>
                    <p>Total No of students: {countdata.Total_students}</p>
                    <p>Present: {countdata.Student_Present}</p>
                    <p>Absent: {countdata.Student_Absent}</p>
                    <p>Total No of Teachers: {countdata.Total_staff}</p>
                    <p>Present: {countdata.Staff_Present}</p>
                    <p>Absent: {countdata.Staff_Absent}</p>
                  </>
                )}
              </div>
            </GridItem>
            <GridItem title="Analysis">
              <LineCharts data={linedata} />
            </GridItem>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export function Attendance_DB_Admin() {
  const [selectedYearGroup, setSelectedYearGroup] = useState('Student');
  const [data, setData] = useState([]);
  const [countdata, setCountData] = useState(null);
  const [linedata, setLineData] = useState([]);
  const departmentMapping = {
    'Artificial Intelligence and Data Science': 'AI',
    'Civil Engineering': 'CE',
    'Computer Science and Business Systems': 'CB',
    'Computer Science and Design': 'CD',
    'Computer Science and Engineering': 'CS',
    'Electrical and Electronics Engineering': 'EE',
    'Electronics and Communication Engineering': 'EC',
    'Electronics and Instrumentation Engineering': 'EI',
    'Information Technology': 'IT',
    'Mechanical Engineering': 'ME',
  };
  const transformData = (data) => {
    return data.map((item) => ({
      name: departmentMapping[item.name] || item.name, 
      present: item.present,
      absent: item.absent
    }))};
  const notifyFailure = (error) => {
    toast.error(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.post("http://localhost:3000/attendance/admin-attendance-summary", {user: selectedYearGroup });
        console.log('Attendance summary data:', response.data);
        setData(transformData(response.data));
        console.log(data);
        const response2 = await axios.post("http://localhost:3000/attendance/admin-attendance-count-summary", {});
        console.log('Attendance count summary data:', response2.data);
        setCountData(response2.data);

        const response3 = await axios.post("http://localhost:3000/attendance/admin-attendance-graph", {user: selectedYearGroup });
        console.log('Attendance graph data:', response3.data);
        setLineData(response3.data);
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
          notifyFailure(new Error(error.response.data.error || 'Server Error'));
        } else if (error.request) {
          console.error('Network Error:', error.request);
          notifyFailure(new Error('Network Error'));
        } else {
          console.error('Request Error:', error.message);
          notifyFailure(new Error('Request Error'));
        }
      }
    }
    getData();
  }, [selectedYearGroup]);

  const handleYearGroupSelect = (yearGroup) => {
    setSelectedYearGroup(yearGroup);
    setLineData([]);
  };

  return (
    <div>
      <BatchSelector onBatchSelect={handleYearGroupSelect} />
      <div className='home-grid-db'>
        <div className="grid-containers">
          <div className='home-grid-db'>
            <GridItem title="Attendance">
              <Attendance_BC_Admin data={data}/>
            </GridItem>
            <GridItem title="Data">
              <div className='content-container'>
                {countdata !== null && (
                  <>
                    <p>Total No of students: {countdata.Total_students}</p>
                    <p>Present: {countdata.Student_Present}</p>
                    <p>Absent: {countdata.Student_Absent}</p>
                    <p>Total No of Teachers: {countdata.Total_staff}</p>
                    <p>Present: {countdata.Staff_Present}</p>
                    <p>Absent: {countdata.Staff_Absent}</p>
                  </>
                )}
              </div>
            </GridItem>
            <GridItem title="Analysis">
              <LineCharts data={linedata} />
            </GridItem>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

const Attendance_Dashboard = () => {
  return (
    (window.localStorage.getItem("userType")=== "hod") ? <Attendance_DB_Dept /> : <Attendance_DB_Admin />
  );

}

export default Attendance_Dashboard;
