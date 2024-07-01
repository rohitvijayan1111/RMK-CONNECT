import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/Logo.png';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(`Username: ${username}, Password: ${password},Role: ${role}`);
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
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      
    </div>
  );
}

export default Signup;