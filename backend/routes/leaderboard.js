const express = require('express');
const User = require('../models/User');
const Attempt = require('../models/Attempt');

const router = express.Router();

// GET /api/leaderboard/global  — top users by total score
router.get('/global', async (req, res) => {
  try {
    const users = await User.find()
      .select('username totalScore quizzesPlayed bestScore quizzesWon createdAt')
      .sort('-totalScore')
      .limit(20);

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      _id: u._id,
      username: u.username,
      totalScore: u.totalScore,
      quizzesPlayed: u.quizzesPlayed,
      bestScore: u.bestScore,
      quizzesWon: u.quizzesWon,
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leaderboard/quiz/:quizId  — top scores for a specific quiz
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const attempts = await Attempt.find({ quiz: req.params.quizId })
      .populate('user', 'username')
      .sort('-score timeTaken')
      .limit(10);

    const leaderboard = attempts.map((a, i) => ({
      rank: i + 1,
      username: a.user?.username || 'Unknown',
      score: a.score,
      percentage: a.percentage,
      timeTaken: a.timeTaken,
      correctCount: a.correctCount,
      completedAt: a.completedAt,
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
