import React from 'react';
import { motion } from 'framer-motion';

// Parent container ke liye animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Children ko ek ke baad ek animate karega
    },
  },
  exit: {
    opacity: 0,
    transition: { ease: 'easeInOut' }
  }
};

// Child elements ke liye animation variants
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function HomePage({ navigateToTracker }) {
  return (
    <motion.div 
      className="homepage-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="homepage-content">
        <motion.h1 variants={itemVariants}>Welcome to HabitDot</motion.h1>
        <motion.p variants={itemVariants}>The simple, beautiful way to track your habits and build a better you, one day at a time.</motion.p>
        <motion.div variants={itemVariants}>
          <motion.button 
            onClick={navigateToTracker} 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Tracking Now
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HomePage;