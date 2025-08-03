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
import AboutPage from './components/AboutPage';
import HowToUsePage from './components/HowToUsePage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [viewingHabitId, setViewingHabitId] = useState(null);
  const [theme, setTheme] = useState('light');

  console.log("App Rendered -> Current Page:", currentPage, "| Token Exists:", !!token);

  const toggleTheme = () => { /* ... code same rahega ... */ };
  useEffect(() => { /* ... code same rahega ... */ }, []);
  useEffect(() => { /* ... code same rahega ... */ }, [theme]);

  const handleLogin = (token) => {
    console.log("1. handleLogin function called.");
    try {
      const decoded = jwtDecode(token);
      console.log("2. Token decoded successfully:", decoded);
      setUsername(decoded.user.username);
      setToken(token);
      localStorage.setItem('token', token);
      setCurrentPage('tracker');
    } catch (error) {
      console.error("Error decoding token in handleLogin:", error);
      logout();
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("App Loading -> Found token in localStorage:", storedToken);
    if (storedToken) {
      handleLogin(storedToken);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => { /* ... code same rahega ... */ };
  const viewHabitDetails = (habitId) => { /* ... code same rahega ... */ };
  const backToTracker = () => { /* ... code same rahega ... */ };

  const renderPage = () => {
    if (viewingHabitId) {
        return <motion.div key="detail"><HabitDetailPage habitId={viewingHabitId} backToTracker={backToTracker} /></motion.div>;
    }
    if (currentPage === 'tracker' && !token) {
      console.log("Redirecting to Login page because no token.");
      return <motion.div key="login-redirect"><LoginPage handleLogin={handleLogin} setCurrentPage={setCurrentPage} /></motion.div>;
    }
    switch (currentPage) {
      case 'home':
        return <motion.div key="home"><HomePage navigateToTracker={() => setCurrentPage(token ? 'tracker' : 'login')} /></motion.div>;
      case 'about':
        return <motion.div key="about"><AboutPage /></motion.div>;
      case 'how-to-use':
        return <motion.div key="how-to-use"><HowToUsePage /></motion.div>;
      case 'tracker':
        console.log("Rendering TrackerPage.");
        return <motion.div key="tracker-main"><TrackerPage token={token} viewHabitDetails={viewHabitDetails} /></motion.div>;
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
