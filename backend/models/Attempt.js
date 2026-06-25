const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ type: Number }],         // user's chosen option indexes
  score: { type: Number, default: 0 },
  totalPossible: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 }, // in seconds
  percentage: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// One attempt per user per quiz (keep best score logic in routes)
attemptSchema.index({ user: 1, quiz: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);
