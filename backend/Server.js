const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable cross-origin requests (important for React frontend)

// Correct MongoDB URI (using the SRV connection string format)
const mongoURI = 'mongodb+srv://varunreddy2new:Varun%404545@cms.v9l9d.mongodb.net/CollegeMembers?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define a Mongoose schema and model for the data with a specified collection name
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }
}, { collection: 'Members' });  // Specify the exact collection name

const User = mongoose.model('admin', userSchema);

// API endpoint to store data
app.post('/api/signup', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const newUser = new User({ name });
    await newUser.save();
    res.status(201).json({ message: 'User data stored successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving user data', error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
