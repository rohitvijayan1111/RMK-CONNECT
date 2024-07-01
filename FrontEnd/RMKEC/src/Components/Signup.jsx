import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/Logo.png';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  // Register a new user
  const registerUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', userData);
      console.log(response.data);
      setError('ee');
    } catch (error) {
      console.error('Error registering user hehehehh:', error);
      if (error.response) {
        setError(error.response.data);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  // Example usage
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await registerUser({
        username: username.toLowerCase(),
        password: password,
        role: role.toLowerCase()
      });
      console.log(`Username: ${username}, Password: ${password}`);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };
  
  return (
    <div className="login-form">
      
        <div className="flower-logo"><img src={logo}/> </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="username"
            placeholder='USERNAME'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder='PASSWORD'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="role"
            placeholder='Role'
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
        {error && <h6 className="error">{error}</h6>} {/* Display error */}
      </form>
      
    </div>
  );
}

export default Signup;