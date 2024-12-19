const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable cross-origin requests

// MongoDB connection URI
const mongoURI = 'mongodb+srv://varunreddy2new:Varun%404545@cms.v9l9d.mongodb.net/CollegeMembers?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define a common user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  collegeId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Check if the models already exist. If not, create them
const Admin = mongoose.models.Admin || mongoose.model('Admin', userSchema, 'Admin');
const Lead = mongoose.models.Lead || mongoose.model('Lead', userSchema, 'Lead');
const Member = mongoose.models.Member || mongoose.model('Member', userSchema, 'Member');

// API endpoint for signup
app.post('/api/signup', async (req, res) => {
  const { name, collegeId, email, password, role } = req.body;

  // Validation check
  if (!name || !collegeId || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  // Dynamically select the model based on the role
  let userModel;
  if (role === 'admin') {
    userModel = Admin;
  } else if (role === 'lead') {
    userModel = Lead;
  } else if (role === 'member') {
    userModel = Member;
  } else {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Create a new user document
  const newUser = new userModel({
    name,
    collegeId,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} data stored successfully` });
  } catch (err) {
    console.error('Error storing user data:', err);
    res.status(500).json({ message: 'Error storing user data', error: err });
  }
});

// API endpoint for login
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;

  // Validation check
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Dynamically select the model based on the role
  let userModel;
  if (role === 'admin') {
    userModel = Admin;
  } else if (role === 'lead') {
    userModel = Lead;
  } else if (role === 'member') {
    userModel = Member;
  } else {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    // Find the user by email in the corresponding collection
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email, role } });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Error during login', error: err });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
