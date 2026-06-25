import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getGlobalLeaderboard } from '../utils/api';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getGlobalLeaderboard()
      .then((r) => setData(r.data))
      .catch(() => toast.error('Could not load leaderboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <h1 className="page-title">🏆 Leaderboard</h1>
      <p className="page-sub">Top players ranked by total score</p>

      {loading ? (
        <div className="loading-box"><div className="spinner" /></div>
      ) : data.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <div className="empty-title">No players yet!</div>
            <div className="empty-sub">Be the first to play a quiz.</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Rank</th>
                <th>Player</th>
                <th style={{ textAlign: 'right' }}>Total Score</th>
                <th style={{ textAlign: 'right' }}>Quizzes</th>
                <th style={{ textAlign: 'right' }}>Best</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const isMe = user && row.username === user.username;
                return (
                  <tr key={row._id} className={isMe ? 'highlight-row' : ''}>
                    <td style={{ textAlign: 'center' }}>
                      {row.rank <= 3
                        ? <span className="rank-medal">{MEDALS[row.rank - 1]}</span>
                        : <span className="rank-num">#{row.rank}</span>}
                    </td>
                    <td>
                      <div className="username-cell">
                        <div className="avatar">{row.username[0].toUpperCase()}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15 }}>
                            {row.username} {isMe && <span style={{ color: '#6366f1' }}>(you)</span>}
                          </div>
                          <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
                            {row.quizzesWon} perfect scores
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 900, fontSize: 16, color: '#6366f1' }}>
                      {row.totalScore.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', color: '#6b7280' }}>{row.quizzesPlayed}</td>
                    <td style={{ textAlign: 'right', color: '#f59e0b', fontWeight: 700 }}>{row.bestScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {user && !data.find((r) => r.username === user.username) && (
        <div style={{ marginTop: 16, background: '#eef2ff', border: '2px solid #a5b4fc', borderRadius: 12, padding: '14px 18px', fontSize: 14, color: '#3730a3', fontWeight: 600 }}>
          🎯 You're not on the leaderboard yet! Play some quizzes to get ranked.
        </div>
      )}
    </div>
  );
}
