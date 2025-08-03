import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import TrackerPage from './components/TrackerPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import HabitDetailPage from './components/HabitDetailPage';
import BackgroundShapes from './components/BackgroundShapes';
import AboutPage from './components/AboutPage'; // Naya page import kiya
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [viewingHabitId, setViewingHabitId] = useState(null);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogin = (token) => {
    const decoded = jwtDecode(token);
    setUsername(decoded.user.username);
    setToken(token);
    localStorage.setItem('token', token);
    setCurrentPage('tracker');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        handleLogin(storedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    setToken(null);
    setUsername('');
    setViewingHabitId(null);
    localStorage.removeItem('token');
    setCurrentPage('home');
  };

  const viewHabitDetails = (habitId) => {
    setViewingHabitId(habitId);
    setCurrentPage('detail');
  };

  const backToTracker = () => {
    setViewingHabitId(null);
    setCurrentPage('tracker');
  };

  const renderPage = () => {
    if (viewingHabitId) {
        return <motion.div key="detail"><HabitDetailPage habitId={viewingHabitId} backToTracker={backToTracker} /></motion.div>;
    }
    if (currentPage === 'tracker' && !token) {
      return <motion.div key="login-redirect"><LoginPage handleLogin={handleLogin} setCurrentPage={setCurrentPage} /></motion.div>;
    }
    switch (currentPage) {
      case 'home':
        return <motion.div key="home"><HomePage navigateToTracker={() => setCurrentPage(token ? 'tracker' : 'login')} /></motion.div>;
      case 'about':
        return <motion.div key="about"><AboutPage /></motion.div>;
      case 'tracker':
        return <motion.div key="tracker-main"><TrackerPage viewHabitDetails={viewHabitDetails} /></motion.div>;
      case 'register':
        return <motion.div key="register"><RegisterPage setCurrentPage={setCurrentPage} /></motion.div>;
      case 'login':
        return <motion.div key="login"><LoginPage handleLogin={handleLogin} setCurrentPage={setCurrentPage} /></motion.div>;
      default:
        return <motion.div key="default-home"><HomePage navigateToTracker={() => setCurrentPage(token ? 'tracker' : 'login')} /></motion.div>;
    }
  };

  return (
    <div className="main-app">
      <BackgroundShapes />
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        token={token} 
        logout={logout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="content-area">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;