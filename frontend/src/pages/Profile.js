import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getMyAttempts, formatTime } from '../utils/api';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
    getMyAttempts()
      .then((r) => setAttempts(r.data))
      .catch(() => toast.error('Could not load history'))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  if (!user) return null;

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      {/* Profile header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: '#eef2ff', border: '3px solid #a5b4fc',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, fontWeight: 900, color: '#6366f1', flexShrink: 0,
        }}>
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>@{user.username}</div>
          <div style={{ color: '#9ca3af', fontSize: 14, fontWeight: 600 }}>{user.email}</div>
          {user.role === 'admin' && (
            <span className="badge badge-purple" style={{ marginTop: 4, display: 'inline-block' }}>⚡ Admin</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Score', value: (user.totalScore || 0).toLocaleString(), emoji: '⭐', color: '#6366f1' },
          { label: 'Quizzes Played', value: user.quizzesPlayed || 0, emoji: '🎮', color: '#22c55e' },
          { label: 'Perfect Scores', value: user.quizzesWon || 0, emoji: '🏆', color: '#f59e0b' },
          { label: 'Best Score', value: user.bestScore || 0, emoji: '🔥', color: '#ef4444' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{s.emoji}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* History */}
      <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>📋 Quiz History</h2>

      {loading ? (
        <div className="loading-box"><div className="spinner" /></div>
      ) : attempts.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No quizzes played yet</div>
            <div className="empty-sub">
              <Link to="/quizzes" style={{ color: '#6366f1', fontWeight: 700 }}>Play a quiz</Link> to see your history here!
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Score</th>
                <th style={{ textAlign: 'right' }}>%</th>
                <th style={{ textAlign: 'right' }}>Time</th>
                <th style={{ textAlign: 'right' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => {
                const pct = a.percentage;
                const pctColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';
                return (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 700 }}>{a.quiz?.title || 'Deleted Quiz'}</td>
                    <td>
                      <span className="badge badge-purple">{a.quiz?.category || '?'}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: '#6366f1' }}>
                      {a.score}/{a.totalPossible}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: pctColor }}>
                      {pct}%
                    </td>
                    <td style={{ textAlign: 'right', color: '#9ca3af' }}>{formatTime(a.timeTaken)}</td>
                    <td style={{ textAlign: 'right', color: '#9ca3af', fontSize: 13 }}>
                      {new Date(a.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
