import express, { ErrorRequestHandler } from 'express';
import db from './models';
import cors from 'cors';
import summonerRoutes from './routes/summonerRoutes';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();


const { sequelize } = db;
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://splinter-frontend.onrender.com', process.env.FRONTEND_URL].filter(Boolean)
    : ['http://localhost:5173'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', summonerRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Error handling middleware with explicit ErrorRequestHandler type
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  
  // Handle specific error types
  if (err.message?.includes('not found')) {
    res.status(404).json({ error: err.message });
    return; // Just return, don't return res.status
  }
  
  if (err.message?.includes('API key')) {
    res.status(403).json({ error: err.message });
    return;
  }
  
  if (err.message?.includes('Rate limit')) {
    res.status(429).json({ error: err.message });
    return;
  }
  
  // Generic server error for all other cases
  res.status(500).json({ 
    error: 'Something went wrong on the server',
    message: (process.env.NODE_ENV || 'production') === 'development' ? err.message : undefined
  });
};

// Apply the error handling middleware
app.use(errorHandler);

// Export the app
export default app;

// Add a module check to start the server only if this file is executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  
  sequelize.authenticate()
    .then(() => {
      console.log('Database connection established');
      
      // Optional: sync models with database (use with caution in production)
      // return sequelize.sync();
    })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Unable to connect to database:', err);
      process.exit(1); // Exit with error code if DB connection fails
    });
}