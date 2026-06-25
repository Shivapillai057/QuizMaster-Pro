const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: 'Please fill in all fields.' });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(400).json({ message: 'Username or email already taken.' });

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      totalScore: user.totalScore,
      quizzesPlayed: user.quizzesPlayed,
      token: makeToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please enter email and password.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Wrong email or password.' });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      totalScore: user.totalScore,
      quizzesPlayed: user.quizzesPlayed,
      bestScore: user.bestScore,
      token: makeToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/auth/me  — get current user profile
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});

module.exports = router;
