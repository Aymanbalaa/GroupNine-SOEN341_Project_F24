// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb+srv://aymanbalaa30:SOEN341GROUP9@soen341.flzqs.mongodb.net/?retryWrites=true&w=majority&appName=SOEN341', {
  useNewUrlParser: true,
  useUnifiedTopology: true,})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/team', require('./routes/team'));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
