const express = require('express');
const Quiz = require('../models/Quiz');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/quizzes  — list all published quizzes (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const quizzes = await Quiz.find(filter)
      .select('-questions.correctAnswer -questions.explanation')
      .populate('createdBy', 'username')
      .sort('-createdAt');

    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/quizzes/:id  — get single quiz (full, for playing)
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.correctAnswer -questions.explanation')
      .populate('createdBy', 'username');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/quizzes  — create quiz (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/quizzes/:id  — update quiz (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/quizzes/:id  — delete quiz (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
