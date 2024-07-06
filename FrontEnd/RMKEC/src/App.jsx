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

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignPage />} />
          <Route path="/dashboard/*" element={<Layout />}>
            <Route index element={<DashBoard />} />
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
          </Route>
        </Routes>
      </Router>
    </div>
    </LocalizationProvider>
  );
}

export default App;
