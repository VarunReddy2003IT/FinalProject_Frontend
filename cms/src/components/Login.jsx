import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // Default role
  const [message, setMessage] = useState(''); // For feedback messages
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Check if the user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      // If a user is logged in, redirect to home page or dashboard
      alert('Already logged in!');
      navigate('/app');  // Redirect to home or dashboard page
    }
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!email.trim() || !password.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role,
      });

      // Show success message and navigate to a success page
      setMessage(response.data.message); 
      setEmail('');
      setPassword('');

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({ email, role }));

      // Navigate to the success page with role information
      navigate(`/success?role=${role}`);
    } catch (error) {
      console.error('Error during login:', error);
      setMessage(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3>Login</h3>
        {message && <p className="message">{message}</p>}
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
        />
        <select name="role" value={role} onChange={handleInputChange}>
          <option value="admin">Admin</option>
          <option value="lead">Lead</option>
          <option value="member">Member</option>
        </select>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
