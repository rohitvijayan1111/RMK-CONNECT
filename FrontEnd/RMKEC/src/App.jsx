import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Components/Layout';
import DashBoard from './Pages/DashBoard';
import LoginPage from './Pages/LoginPage';
import SignPage from './Pages/Signup';
import Guestlecture from "./Pages/Guestlecture";
import Facultydetails from "./Pages/Facultydetails";
import Coursecoverage from "./Pages/Coursecoverage";
import Sports from "./Pages/Sports";
import Achievements from "./Pages/Achievements";
import Clubactivities from "./Clubactivities";
import CreateForm from "./Pages/CreateForm";
import EmailNotification from "./Pages/EmailNotification";

function App() {
  return (
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
            <Route path="create-form" element={<CreateForm/>}/>      
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
