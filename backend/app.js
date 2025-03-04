const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors'); // Add CORS for frontend integration
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// Routes
app.use('/api/auth', require('./routes/auth'));

// Default route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Add this to create tables if they don't exist
    await sequelize.sync(); // { force: true } would drop and recreate tables (careful!)
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});