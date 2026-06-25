import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/quizzes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 10 }}>🧠</div>
        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-sub">Log in to continue playing</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handle} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" placeholder="Your password"
              value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Logging in...' : '🚀 Log In'}
          </button>
        </form>

        {/* Demo hint */}
        <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginTop: 16, fontSize: 13, color: '#15803d' }}>
          <strong>Demo Admin:</strong> admin@quiz.com / admin123
        </div>

        <p className="auth-footer">
          New here? <Link to="/register">Create a free account</Link>
        </p>
      </div>
    </div>
  );
}
