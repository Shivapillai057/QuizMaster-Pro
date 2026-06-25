const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],  // Array of 4 options
  correctAnswer: { type: Number, required: true, min: 0, max: 3 }, // index 0-3
  explanation: { type: String, default: '' },
  points: { type: Number, default: 10 },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: ['General Knowledge', 'Science', 'History', 'Sports', 'Technology', 'Math', 'Geography', 'Entertainment'],
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  questions: [questionSchema],
  timeLimit: { type: Number, default: 30 }, // seconds per question
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: true },
  timesPlayed: { type: Number, default: 0 },
  thumbnail: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
