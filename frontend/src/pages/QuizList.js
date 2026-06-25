import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getQuizzes, CATEGORY_EMOJI, DIFFICULTY_COLOR, DIFFICULTY_BG } from '../utils/api';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getQuizzes({ category, difficulty })
      .then((r) => setQuizzes(r.data))
      .catch(() => toast.error('Could not load quizzes'))
      .finally(() => setLoading(false));
  }, [category, difficulty]);

  const handlePlay = (quiz) => {
    if (!user) {
      toast('Please log in to play! 👤', { icon: '🔒' });
      navigate('/login');
      return;
    }
    navigate(`/play/${quiz._id}`);
  };

  return (
    <div className="page">
      <h1 className="page-title">📚 All Quizzes</h1>
      <p className="page-sub">Pick a quiz and start earning points!</p>

      {/* Filters */}
      <div className="filters">
        <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">🌐 All Categories</option>
          {['General Knowledge', 'Science', 'History', 'Sports', 'Technology', 'Math', 'Geography', 'Entertainment']
            .map((c) => <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</option>)}
        </select>

        <select className="filter-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All Difficulties</option>
          <option value="Easy">🟢 Easy</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Hard">🔴 Hard</option>
        </select>

        {(category || difficulty) && (
          <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 14 }}
            onClick={() => { setCategory(''); setDifficulty(''); }}>
            ✕ Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-box"><div className="spinner" /></div>
      ) : quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No quizzes found</div>
          <div className="empty-sub">Try a different filter</div>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card" onClick={() => handlePlay(quiz)}>
              <div className="quiz-category">{CATEGORY_EMOJI[quiz.category] || '📝'}</div>
              <div className="quiz-title">{quiz.title}</div>
              {quiz.description && <div className="quiz-desc">{quiz.description}</div>}
              <div className="quiz-meta">
                <span className="badge badge-purple">{quiz.category}</span>
                <span className="badge" style={{
                  background: DIFFICULTY_BG[quiz.difficulty],
                  color: DIFFICULTY_COLOR[quiz.difficulty],
                }}>
                  {quiz.difficulty}
                </span>
                <span className="badge badge-gray">⏱ {quiz.timeLimit}s/Q</span>
                <span className="badge badge-gray">❓ {quiz.questions?.length} Qs</span>
              </div>
              {quiz.timesPlayed > 0 && (
                <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
                  🎮 {quiz.timesPlayed} plays
                </div>
              )}
              <button className="play-btn">▶ Play Quiz</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
