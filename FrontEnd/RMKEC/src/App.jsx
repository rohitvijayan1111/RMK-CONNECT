import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Components/Layout';
import DashBoard from './Pages/DashBoard';
import LoginPage from './Pages/LoginPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import SignPage from './Pages/Signup';
import Guestlecture from "./Pages/Guestlecture";
import Facultydetails from "./Pages/Facultydetails";
import Coursecoverage from "./Pages/Coursecoverage";
import Sports from "./Pages/Sports";
import Achievements from "./Pages/Achievements";
import Clubactivities from "./Pages/Clubactivities";
import EmailNotification from "./Pages/EmailNotification";
import EditForm from "./Pages/EditForm";
import ViewForm from "./Pages/ViewForm";
import AddForm from "./Pages/AddForm";
import Dashboard_admin from "./Pages/Dashboard_admin";
import { Placements } from "./Pages/Placements";
import Daily_Attendance from "./Attendance_Component/Daily-Attendance";
import Edit_Entry from "./Attendance_Component/Edit_Entry";
import Attendance_Log from "./Attendance_Component/Attendance_Log";
import Todays_List from "./Attendance_Component/Todays_List";
import Attendance_Analysis from "./Attendance_Component/Attendance_Analysis";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignPage />} />
          <Route path="/dashboard/*" element={<Layout />}>
            <Route index element={<DashBoard/>} />
            <Route path="club-activity" element={<Clubactivities/>} />
            <Route path="mail" element=  {<EmailNotification />} />
            <Route path="guest-lecture" element={<Guestlecture />} />
            <Route path="faculty-details" element={<Facultydetails />} />
            <Route path="course-coverage" element={<Coursecoverage />} />
            <Route path="sports" element={<Sports />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="view-form" element={<ViewForm/>}/>
            <Route path="view-form/edit-form" element={<EditForm/>}/>
            <Route path="view-form/add-form" element={<AddForm/>}/>
            <Route path="placements" element={<Placements/>} />
            <Route path="Daily-Attendance" element={<Daily_Attendance/>} />  
            <Route path="Edit-Entry" element={<Edit_Entry/>} />  
            <Route path="Attendance-Log" element={<Attendance_Log/>} />  
            <Route path="Todays-List" element={<Todays_List/>} />  
            <Route path="Attendance-Analysis" element={<Attendance_Analysis/>} />  
          </Route>
        </Routes>
      </Router>
    </div>
    </LocalizationProvider>
  );
}

export default App;
