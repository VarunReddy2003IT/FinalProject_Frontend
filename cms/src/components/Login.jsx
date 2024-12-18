import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // Default role as 'member'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'role') {
      setRole(value);
    }
  };

  const handleSubmit = async () => {
    // Validations
    if (!email.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role,
      });

      alert(response.data.message); // Show success message
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to login');
    }
  };

  return (
    <div className="overall">
      <h3>Login</h3>
      <input
        type="email"
        name="email"
        value={email}
        onChange={handleInputChange}
        placeholder="Enter your email"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={handleInputChange}
        placeholder="Enter your password"
      />
      <select name="role" value={role} onChange={handleInputChange}>
        <option value="admin">Admin</option>
        <option value="lead">Lead</option>
        <option value="member">Member</option>
      </select>
      <div className="button-container">
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
}

export default Login;
