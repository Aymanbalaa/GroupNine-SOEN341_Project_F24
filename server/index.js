const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const testEmailRoute = require('./routes/testEmail');

const app = express();
const { router: authRoutes } = require('./routes/auth'); // Correct import for auth routes

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb+srv://aymanbalaa30:SOEN341GROUP9@soen341.flzqs.mongodb.net/?retryWrites=true&w=majority&appName=SOEN341', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Correct usage of auth routes
app.use('/api/team', require('./routes/team'));
app.use('/api/peer-assessment', require('./routes/peerAssessment')); // Ensure this line is present and correct
app.use('/api', testEmailRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
