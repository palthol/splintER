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
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
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


const PORT = process.env.PORT || 5000;
let server: any;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established');
    
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Keep your graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        sequelize.close().then(() => {
          console.log('Database connection closed');
          process.exit(0);
        });
      });
    });
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
    process.exit(1);
  });