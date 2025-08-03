import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api'; // Naya import

function RegisterPage({ setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setMessage('Password must be at least 6 characters long');
    try {
      const res = await api.post('/users/register', { username, password }); // axios.post ki jagah api.post
      setMessage(res.data.message + ' Redirecting to login...');
      setTimeout(() => { setCurrentPage('login'); }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return ( <motion.div className="auth-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><h2>Register</h2><form onSubmit={onSubmit} className="auth-form"><div className="form-group"><label>Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></div><div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div><button type="submit" className="cta-button">Register</button></form>{message && <p className="message">{message}</p>}</motion.div> );
}
export default RegisterPage;