import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../models';

function signToken(payload: any, secret: string, options: any): string {
  // This wrapper bypasses TypeScript's strict typing while maintaining functionality
  return jwt.sign(payload, secret, options);
}

const router = express.Router();
const User = db.User;
const jwtSecret = process.env.JWT_SECRET || 'default-dev-secret';

// Helper function to get JWT expiration from env or use default
const getJwtExpiration = (): string => {
  return process.env.JWT_EXPIRATION || '24h';
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a user
 * @access  Public
 */
router.post('/register', [
  // Validation middleware
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Registration attempt');
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation failed:', errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    console.log('Validation passed');
    
    const { username, email, password, riotId } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('Email already exists');
      res.status(400).json({ msg: 'Email already in use' });
      return;
    }
    
    // Generate unique usernameId
    const usernameId = uuidv4();
    console.log('Generated usernameId:', usernameId);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log('Password hashed');
    
    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      riotId: riotId || null,
      usernameId
    });
    
    console.log('User created:', user.id);
    
    res.status(201).json({
      msg: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        usernameId: user.usernameId
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err.message);
    next(err);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', [
  // Validation middleware
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Login attempt');
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation failed:', errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    console.log('Validation passed');
    
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      res.status(400).json({ msg: 'Invalid credentials' });
      return;
    }
    
    console.log('User found:', user.id);
    
    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('Password incorrect');
      res.status(400).json({ msg: 'Invalid credentials' });
      return;
    }
    
    console.log('Password verified');
    
    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    try {
      // Use the wrapper function instead of direct jwt.sign call
      const token = signToken(
        payload, 
        jwtSecret,
        { expiresIn: getJwtExpiration() }
      );
      
      console.log('JWT generated');
      res.json({ token });
    } catch (jwtErr) {
      console.error('JWT error:', jwtErr);
      next(jwtErr);
    }
    
  } catch (err: any) {
    console.error('Login error:', err.message);
    next(err);
  }
});

export default router;