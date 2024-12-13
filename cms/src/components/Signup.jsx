import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [name, setName] = useState('');

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Please enter a valid name');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', { name });
      alert(response.data.message); // Show success message
      setName(''); // Clear the input field after storing data
    } catch (error) {
      console.error('Error storing data:', error);
      alert('Failed to store data');
    }
  };

  return (
    <div>
      <input
        type="text"
        className="nameinput"
        value={name}
        onChange={handleInputChange}
        placeholder="Enter your name"
      />
      <button onClick={handleSubmit}>Store data</button>
    </div>
  );
}

export default Signup;
