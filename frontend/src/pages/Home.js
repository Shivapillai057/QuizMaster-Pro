import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-emoji">🧠</div>
        <h1 className="hero-title">
          Test Your Knowledge,<br />
          <span>Climb the Leaderboard!</span>
        </h1>
        <p className="hero-sub">
          Answer fun quiz questions, score points, and compete with friends.
          Totally free and beginner-friendly!
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/quizzes">
            <button className="btn btn-primary btn-lg">🎮 Play Now</button>
          </Link>
          {!user && (
            <Link to="/register">
              <button className="btn btn-secondary btn-lg">✨ Sign Up Free</button>
            </Link>
          )}
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {[
            { emoji: '📚', title: 'Many Categories', desc: 'Science, History, Sports, Tech & more!' },
            { emoji: '⏱️', title: 'Timed Questions', desc: 'Each question has a timer — answer fast!' },
            { emoji: '🏆', title: 'Live Leaderboard', desc: 'See how you rank against other players.' },
            { emoji: '💡', title: 'Learn As You Go', desc: 'Get explanations after every question.' },
          ].map((f) => (
            <div className="card" key={f.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{f.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
