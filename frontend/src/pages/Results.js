import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { formatTime } from '../utils/api';

const LETTERS = ['A', 'B', 'C', 'D'];

function getGrade(pct) {
  if (pct === 100) return { emoji: '🏆', label: 'Perfect Score!', color: '#f59e0b' };
  if (pct >= 80)  return { emoji: '🎉', label: 'Excellent!',      color: '#22c55e' };
  if (pct >= 60)  return { emoji: '😊', label: 'Good Job!',       color: '#6366f1' };
  if (pct >= 40)  return { emoji: '📚', label: 'Keep Studying!',  color: '#f97316' };
  return            { emoji: '💪', label: 'Try Again!',           color: '#ef4444' };
}

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  if (!state?.result) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 60 }}>
        <p>No results found.</p>
        <Link to="/quizzes"><button className="btn btn-primary" style={{ marginTop: 16 }}>Browse Quizzes</button></Link>
      </div>
    );
  }

  const { result, quizTitle, quizId } = state;
  const grade = getGrade(result.percentage);

  return (
    <div className="quiz-play">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="result-hero">
          <div className="result-grade">{grade.emoji}</div>
          <h1 className="result-title">{grade.label}</h1>
          <p className="result-sub">{quizTitle}</p>

          <div style={{ margin: '24px auto', width: 120, height: 120, borderRadius: '50%',
            background: '#f0f4ff', border: `6px solid ${grade.color}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: grade.color, lineHeight: 1 }}>
              {result.percentage}%
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>SCORE</div>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-num">{result.correctCount}/{result.totalQuestions}</div>
              <div className="stat-lbl">Correct</div>
            </div>
            <div className="stat-box">
              <div className="stat-num" style={{ color: '#f59e0b' }}>{result.score}</div>
              <div className="stat-lbl">Points</div>
            </div>
            <div className="stat-box">
              <div className="stat-num" style={{ color: '#22c55e' }}>{formatTime(result.timeTaken)}</div>
              <div className="stat-lbl">Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer review toggle */}
      <button className="btn btn-secondary btn-full" style={{ marginBottom: 16 }}
        onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? '▲ Hide' : '▼ Review'} Answers
      </button>

      {showDetails && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          {result.results.map((r, i) => (
            <div key={i} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>{r.isCorrect ? '✅' : '❌'}</span>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Q{i + 1}. {r.question}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {r.options.map((opt, j) => {
                  const isCorrect = j === r.correctAnswer;
                  const isUserAnswer = j === r.userAnswer;
                  let bg = '#f9fafb', border = '#e0e7ff', color = '#374151';
                  if (isCorrect) { bg = '#f0fdf4'; border = '#22c55e'; color = '#15803d'; }
                  else if (isUserAnswer && !isCorrect) { bg = '#fff7f7'; border = '#ef4444'; color = '#dc2626'; }

                  return (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 12px', borderRadius: 8, border: `2px solid ${border}`,
                      background: bg, color, fontSize: 13, fontWeight: 600,
                    }}>
                      <span style={{ fontWeight: 900, minWidth: 20 }}>{LETTERS[j]}.</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {isCorrect && <span>✓</span>}
                      {isUserAnswer && !isCorrect && <span>✗ your answer</span>}
                    </div>
                  );
                })}
              </div>

              {r.explanation && (
                <div className="explanation-box" style={{ marginTop: 10 }}>
                  💡 {r.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" style={{ flex: 1 }}
          onClick={() => navigate(`/play/${quizId}`)}>
          🔄 Try Again
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }}
          onClick={() => navigate('/quizzes')}>
          📚 More Quizzes
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }}
          onClick={() => navigate('/leaderboard')}>
          🏆 Leaderboard
        </button>
      </div>
    </div>
  );
}
