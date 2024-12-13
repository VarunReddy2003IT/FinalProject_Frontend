import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'

function Signup() {
  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [role, setRole] = useState('member'); // Default role as 'member'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'collegeId') {
      setCollegeId(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'rePassword') {
      setRePassword(value);
    } else if (name === 'role') {
      setRole(value);
    }
  };

  const handleSubmit = async () => {
    // Validations
    if (!name.trim() || !collegeId.trim() || !email.trim() || !password || !rePassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== rePassword) {
      alert('Passwords do not match');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gvpce\.ac\.in$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email in the format: username@gvpce.ac.in');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', { 
        name, 
        collegeId, 
        email, 
        password, 
        role 
      });

      alert(response.data.message); // Show success message
      setName('');
      setCollegeId('');
      setEmail('');
      setPassword('');
      setRePassword('');
    } catch (error) {
      console.error('Error storing data:', error);
      alert('Failed to store data');
    }
  };

  return (
    <div className='overall'>
     <h3>Signup</h3>
      <input
        type="text"
        name="name"
        value={name}
        onChange={handleInputChange}
        placeholder="Enter your name"
      />
      <input
        type="text"
        name="collegeId"
        value={collegeId}
        onChange={handleInputChange}
        placeholder="Enter your College ID"
      />
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
      <input
        type="password"
        name="rePassword"
        value={rePassword}
        onChange={handleInputChange}
        placeholder="Re-enter your password"
      />
      <select name="role" value={role} onChange={handleInputChange}>
        <option value="admin">Admin</option>
        <option value="lead">Lead</option>
        <option value="member">Member</option>
      </select>
      <div className="button-container">
    <button onClick={handleSubmit}>Store data</button>
  </div>
    </div>
  );
}

export default Signup;
