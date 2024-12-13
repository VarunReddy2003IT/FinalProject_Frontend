const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // To hash passwords

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable cross-origin requests

// MongoDB connection URI (using the SRV connection string format)
const mongoURI = 'mongodb+srv://varunreddy2new:Varun%404545@cms.v9l9d.mongodb.net/CollegeMembers?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define a common user schema (same schema for Admin, Lead, and Member)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  collegeId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Check if the models already exist. If not, create them
const Admin = mongoose.models.Admin || mongoose.model('Admin', userSchema,'Admin');
const Lead = mongoose.models.Lead || mongoose.model('Lead', userSchema,'Lead');
const Member = mongoose.models.Member || mongoose.model('Member', userSchema,'Member');

// API endpoint to store data based on the role
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

  // Create a new user document based on the selected role
  const newUser = new userModel({
    name,
    collegeId,
    email,
    password: hashedPassword,
  });

  // Save the new user to the appropriate collection
  try {
    await newUser.save();
    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} data stored successfully` });
  } catch (err) {
    console.error('Error storing user data:', err);
    res.status(500).json({ message: 'Error storing user data', error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
