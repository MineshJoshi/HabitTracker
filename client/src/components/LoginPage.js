import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

function LoginPage({ handleLogin, setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/login', { username, password });
      handleLogin(res.data.token);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="cta-button">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p className="auth-switch">
        Don't have an account? <span onClick={() => setCurrentPage('register')}>Register here</span>
      </p>
    </motion.div>
  );
}

export default LoginPage;
