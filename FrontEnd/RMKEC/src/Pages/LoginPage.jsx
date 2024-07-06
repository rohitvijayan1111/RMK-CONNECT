import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/Logo.png';
import axios from 'axios';
import { ToastContainer, toast,Zoom} from 'react-toastify';
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const notifysuccess = () =>{
    toast.success('Signed In Successfully!', {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
      });
  }
  const notifyfailure=(error)=>{
    toast.error(error, {
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
  }
  const validateUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', userData);
      window.localStorage.setItem('department',response.data.department); 
      window.localStorage.setItem('userType', response.data.role);
      window.localStorage.setItem('loggedIn', 'true');
      notifysuccess();
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error logging in:', error.response);
      window.localStorage.setItem('loggedIn', 'false');
      if (error.response && error.response.data) {
        console.log('Error message from backend:', error.response.data);
        notifyfailure(error.response.data);  
      } else {
        notifyfailure(error.response.data);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validateUser({ username: username.toLowerCase(), password: password });
    console.log(`Username: ${username}, Password: ${password}`);
  };

  return (
    <div className='loginpage'>
    <div className="login-form">
      <div className="flower-logo">
        <img src={logo} alt="Logo" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="username"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
    </div>
    <ToastContainer />
    </div>
  );
}

export default LoginPage;
