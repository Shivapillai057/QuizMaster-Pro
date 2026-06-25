import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getQuiz, submitAttempt, formatTime } from '../utils/api';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function PlayQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('intro'); // intro | playing | submitting
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    getQuiz(quizId)
      .then((r) => setQuiz(r.data))
      .catch(() => { toast.error('Quiz not found'); navigate('/quizzes'); })
      .finally(() => setLoading(false));
  }, [quizId, navigate]);

  const revealAnswer = useCallback((chosenIdx) => {
    clearInterval(timerRef.current);
    setSelected(chosenIdx);
    setRevealed(true);
    setAnswers((prev) => [...prev, chosenIdx ?? -1]);
  }, []);

  // Timer tick
  useEffect(() => {
    if (phase !== 'playing' || revealed) return;
    const limit = quiz?.timeLimit || 30;
    setTimeLeft(limit);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { revealAnswer(null); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qIndex, phase, revealed, quiz, revealAnswer]);

  const startQuiz = () => {
    setPhase('playing');
    setStartTime(Date.now());
    setQIndex(0);
    setAnswers([]);
    setSelected(null);
    setRevealed(false);
  };

  const nextQuestion = () => {
    if (qIndex + 1 >= quiz.questions.length) {
      submitQuiz();
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const submitQuiz = async () => {
    setPhase('submitting');
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    try {
      const res = await submitAttempt({ quizId, answers, timeTaken });
      navigate('/results', { state: { result: res.data, quizTitle: quiz.title, quizId } });
    } catch {
      toast.error('Could not save your results. Try again.');
      setPhase('playing');
    }
  };

  if (loading) return <div className="loading-box"><div className="spinner" /></div>;
  if (!quiz) return null;

  const q = quiz.questions[qIndex];
  const limit = quiz.timeLimit || 30;
  const isWarning = timeLeft <= 10;

  // ── INTRO SCREEN ──
  if (phase === 'intro') {
    return (
      <div className="quiz-play">
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎮</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{quiz.title}</h1>
          {quiz.description && <p style={{ color: '#6b7280', marginBottom: 20 }}>{quiz.description}</p>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            <span className="badge badge-purple">📂 {quiz.category}</span>
            <span className="badge badge-gray">❓ {quiz.questions.length} Questions</span>
            <span className="badge badge-gray">⏱ {quiz.timeLimit}s per question</span>
            <span className="badge badge-gray">🏅 {quiz.questions.length * 10} pts possible</span>
          </div>
          <div style={{ background: '#f0f4ff', border: '2px solid #e0e7ff', borderRadius: 12, padding: '14px 20px', marginBottom: 24, fontSize: 14, color: '#4338ca', textAlign: 'left' }}>
            <strong>How it works:</strong><br />
            • Read each question carefully<br />
            • Pick one of the 4 options before time runs out<br />
            • You'll see if you were right after each question<br />
            • Score as many points as you can!
          </div>
          <button className="btn btn-primary btn-lg" onClick={startQuiz}>🚀 Start Quiz!</button>
        </div>
      </div>
    );
  }

  // ── SUBMITTING ──
  if (phase === 'submitting') {
    return (
      <div className="quiz-play">
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div className="spinner" style={{ marginBottom: 20 }} />
          <p style={{ fontWeight: 700, color: '#6b7280' }}>Saving your results…</p>
        </div>
      </div>
    );
  }

  // ── PLAYING ──
  return (
    <div className="quiz-play">
      {/* Progress header */}
      <div className="question-progress">
        <span>Question {qIndex + 1} of {quiz.questions.length}</span>
        <div className={`timer ${isWarning ? 'warning' : ''}`}>
          {isWarning ? '⚠️' : '⏱'} {timeLeft}s
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((qIndex + 1) / quiz.questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="question-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span className="badge badge-purple">{quiz.category}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af' }}>
            {formatTime(limit - timeLeft)} elapsed
          </span>
        </div>
        <div className="question-text">{q.question}</div>

        <div className="options-grid">
          {q.options.map((opt, i) => {
            let cls = 'option-btn';
            if (revealed) {
              // Note: we don't have correctAnswer on frontend — show selected
              // The actual grading happens on the backend
              if (i === selected) cls += ' selected';
            } else {
              if (i === selected) cls += ' selected';
            }

            return (
              <button
                key={i}
                className={cls}
                disabled={revealed}
                onClick={() => !revealed && revealAnswer(i)}
              >
                <span className="option-letter">{LETTERS[i]}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="explanation-box">
            {selected === null
              ? '⏰ Time\'s up! The answer will be revealed on results.'
              : '✅ Answer locked in! Keep going.'}
          </div>
        )}
      </div>

      {revealed && (
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={nextQuestion}>
            {qIndex + 1 >= quiz.questions.length ? '🏁 See Results' : 'Next Question ➡️'}
          </button>
        </div>
      )}
    </div>
  );
}
