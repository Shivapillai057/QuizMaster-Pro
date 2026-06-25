import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import PlayQuiz from './pages/PlayQuiz';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import './App.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">🧠 QuizBuzz</NavLink>
      <div className="nav-links">
        <NavLink to="/quizzes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          📚 Quizzes
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          🏆 Leaderboard
        </NavLink>
        {user ? (
          <>
            <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              👤 {user.username}
            </NavLink>
            <button className="nav-btn nav-btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login"><button className="nav-btn nav-btn-outline">Log In</button></NavLink>
            <NavLink to="/register"><button className="nav-btn nav-btn-solid">Sign Up</button></NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-box"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/play/:quizId" element={<ProtectedRoute><PlayQuiz /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontFamily: 'Nunito', fontWeight: 700 } }} />
      </Router>
    </AuthProvider>
  );
}
