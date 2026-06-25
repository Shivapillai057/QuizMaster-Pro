const express = require('express');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// POST /api/attempts  — submit quiz answers and get score
router.post('/', async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    // Fetch full quiz WITH correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

    // Grade the answers
    let score = 0;
    let correctCount = 0;
    const totalPossible = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    const results = quiz.questions.map((q, i) => {
      const userAnswer = answers[i] ?? -1;
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) {
        score += q.points;
        correctCount++;
      }
      return {
        question: q.question,
        options: q.options,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        points: q.points,
      };
    });

    const percentage = Math.round((score / totalPossible) * 100);

    // Save attempt
    const attempt = await Attempt.create({
      user: req.user._id,
      quiz: quizId,
      answers,
      score,
      totalPossible,
      correctCount,
      timeTaken: timeTaken || 0,
      percentage,
    });

    // Update quiz play count
    await Quiz.findByIdAndUpdate(quizId, { $inc: { timesPlayed: 1 } });

    // Update user stats
    const user = await User.findById(req.user._id);
    user.totalScore += score;
    user.quizzesPlayed += 1;
    if (percentage === 100) user.quizzesWon += 1;
    if (score > user.bestScore) user.bestScore = score;
    await user.save();

    res.status(201).json({
      score,
      totalPossible,
      correctCount,
      totalQuestions: quiz.questions.length,
      percentage,
      timeTaken,
      results,
      attemptId: attempt._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/attempts/my  — get logged-in user's attempt history
router.get('/my', async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .populate('quiz', 'title category difficulty')
      .sort('-completedAt')
      .limit(20);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
