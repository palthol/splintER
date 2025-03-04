const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

// Helper function to get JWT expiration from env or use default
const getJwtExpiration = () => {
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
], async (req, res) => {
  console.log('Registration attempt');
  
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation failed:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('Validation passed');
  
  const { username, email, password, riotId } = req.body;
  
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('Email already exists');
      return res.status(400).json({ msg: 'Email already in use' });
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
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
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
], async (req, res) => {
  console.log('Login attempt');
  
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation failed:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('Validation passed');
  
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    console.log('User found:', user.id);
    
    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('Password incorrect');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    console.log('Password verified');
    
    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { 
        expiresIn: getJwtExpiration(),
        algorithm: 'HS256'
      },
      (err, token) => {
        if (err) {
          console.error('JWT error:', err.message);
          throw err;
        }
        console.log('JWT generated');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

module.exports = router;