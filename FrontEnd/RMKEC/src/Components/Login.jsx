import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/Logo.png';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Validate user login
  const validateUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', userData);
      window.localStorage.setItem('department',response.data.department); 
      window.localStorage.setItem('userType', response.data.role);
      window.localStorage.setItem('loggedIn', 'true');
      setError(''); 
      if(response.data.role === 'hod') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error logging in:', error.response);
      window.localStorage.setItem('loggedIn', 'false');
      if (error.response && error.response.data) {
        console.log('Error message from backend:', error.response.data);
        setError(error.response.data);  
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validateUser({ username: username.toLowerCase(), password: password });
    console.log(`Username: ${username}, Password: ${password}`);
  };

  return (
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
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
