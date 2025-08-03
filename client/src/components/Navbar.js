import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle'; // Naya component import kiya

const MotionButton = ({ className, onClick, children }) => (
  <motion.button
    className={className}
    onClick={onClick}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
  >
    {children}
  </motion.button>
);

function Navbar({ currentPage, setCurrentPage, token, logout, theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <motion.div 
        className="nav-brand" 
        onClick={() => setCurrentPage('home')}
        whileHover={{ scale: 1.05 }}
      >
        HabitDot 🎯
      </motion.div>
      <div className="nav-links">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} /> {/* Toggle button yahan add kiya */}
        <MotionButton 
          className={currentPage === 'home' ? 'nav-link active' : 'nav-link'}
          onClick={() => setCurrentPage('home')}
        >
          Home
        </MotionButton>
        {token && (
          <MotionButton 
            className={currentPage === 'tracker' ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage('tracker')}
          >
            Tracker
          </MotionButton>
        )}
        
        {!token ? (
          <>
            <MotionButton 
              className={currentPage === 'login' ? 'nav-link active' : 'nav-link'}
              onClick={() => setCurrentPage('login')}
            >
              Login
            </MotionButton>
            <MotionButton 
              className={currentPage === 'register' ? 'nav-link active' : 'nav-link'}
              onClick={() => setCurrentPage('register')}
            >
              Register
            </MotionButton>
          </>
        ) : (
          <MotionButton className="nav-link logout-btn" onClick={logout}>
            Logout
          </MotionButton>
        )}
      </div>
    </nav>
  );
}

export default Navbar;