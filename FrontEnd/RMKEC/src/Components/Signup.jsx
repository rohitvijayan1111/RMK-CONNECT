import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/Logo.png';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');
  const [error, setError] = useState('');

  const registerUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', userData);
      console.log(response.data);
      setError('');
      // Redirect or show success message if needed
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.response) {
        setError(error.response.data);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!username || !password || !role) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await registerUser({
        username: username.toLowerCase(),
        password: password,
        role: role.toLowerCase(),
        department: dept.toLowerCase(),
      });
    } catch (error) {
      console.error('Error registering user:', error);
    }
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
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="role"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="department"
            placeholder="Department/NA"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default Signup;
