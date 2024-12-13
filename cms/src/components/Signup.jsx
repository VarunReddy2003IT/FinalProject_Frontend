import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
function Signup() {
  const [role, setRole] = useState(''); // Admin, Lead, or Member
  const [clubName, setClubName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  // Function to handle role change
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // Function to handle OTP generation (mock implementation)
  const generateOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(randomOtp);
    alert(`OTP sent to ${email}: ${randomOtp}`); // Placeholder for actual email sending
  };

  // Function to verify OTP
  const verifyOtp = () => {
    if (otp === generatedOtp.toString()) {
      setOtpVerified(true);
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP');
    }
  };

  // Email validation: must end with @gvpce.ac.in
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gvpce\.ac\.in$/;
    return regex.test(email);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!role || !email || !collegeId || !password || password !== rePassword) {
      alert('Please fill in all the required fields correctly!');
      return;
    }

    // Email validation
    if (!isValidEmail(email)) {
      alert('Please enter a valid GVPCE email address (e.g., name@gvpce.ac.in).');
      return;
    }

    if (!otpVerified) {
      alert('Please verify the OTP first.');
      return;
    }

    // Handle navigation based on role
    if (role === 'Member') {
      // Redirect to the respective club page (assuming club page logic is available)
      navigate(`/club/${clubName}`);
    } else if (role === 'Lead') {
      // Notify admin or take further action
      alert('Your signup as Lead will be verified by an admin.');
    } else {
      // Admin case
      alert('Signup successful as Admin!');
    }
  };

  return (
    <div className='signup'>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="role">Select Role:</label>
          <select id="role" value={role} onChange={handleRoleChange} required>
            <option value="">-- Select Role --</option>
            <option value="Admin">Admin</option>
            <option value="Lead">Lead</option>
            <option value="Member">Member</option>
          </select>
        </div>

        {/* Club name field - shown only if Lead or Member is selected */}
        {(role === 'Lead' || role === 'Member') && (
          <div>
            <label htmlFor="clubName">Club Name:</label>
            <input
              type="text"
              id="clubName"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              required={role === 'Lead' || role === 'Member'}
            />
          </div>
        )}

        <div>
          <label htmlFor="collegeId">College ID:</label>
          <input
            type="text"
            id="collegeId"
            value={collegeId}
            onChange={(e) => setCollegeId(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email ID:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="rePassword">Re-enter Password:</label>
          <input
            type="password"
            id="rePassword"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="button" onClick={generateOtp}>Send OTP</button>
        </div>

        <div>
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="button" onClick={verifyOtp}>Verify OTP</button>
        </div>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
