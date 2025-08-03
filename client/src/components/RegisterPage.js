import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

function RegisterPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const { fullName, email, username, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password.length < 6) {
      return setMessage('Password must be at least 6 characters long');
    }
    try {
      const res = await api.post('/users/register', { fullName, email, username, password });
      setMessage(res.data.message + ' Redirecting to login...');
      setTimeout(() => {
        setCurrentPage('login'); 
      }, 2000);
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
      <h2>Create Your Account</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" value={fullName} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={username} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit" className="cta-button">Register</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p className="auth-switch">
        Already have an account? <span onClick={() => setCurrentPage('login')}>Login here</span>
      </p>
    </motion.div>
  );
}

export default RegisterPage;