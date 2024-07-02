import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Components/Layout';
import DashBoard from './Pages/DashBoard';
import LoginPage from './Pages/LoginPage';
import SignPage from './Pages/Signup';

function App() {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignPage />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<DashBoard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
