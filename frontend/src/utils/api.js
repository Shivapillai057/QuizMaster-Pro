import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getQuizzes = (params) => axios.get(`${API}/quizzes`, { params });
export const getQuiz = (id) => axios.get(`${API}/quizzes/${id}`);
export const submitAttempt = (data) => axios.post(`${API}/attempts`, data);
export const getMyAttempts = () => axios.get(`${API}/attempts/my`);
export const getGlobalLeaderboard = () => axios.get(`${API}/leaderboard/global`);
export const getQuizLeaderboard = (quizId) => axios.get(`${API}/leaderboard/quiz/${quizId}`);

export const CATEGORY_EMOJI = {
  'General Knowledge': '🌍',
  Science: '🔬',
  History: '📜',
  Sports: '⚽',
  Technology: '💻',
  Math: '➕',
  Geography: '🗺️',
  Entertainment: '🎬',
};

export const DIFFICULTY_COLOR = {
  Easy: '#22c55e',
  Medium: '#f59e0b',
  Hard: '#ef4444',
};

export const DIFFICULTY_BG = {
  Easy: '#dcfce7',
  Medium: '#fef9c3',
  Hard: '#fee2e2',
};

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};
