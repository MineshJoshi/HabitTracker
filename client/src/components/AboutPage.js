import React from 'react';
import { motion } from 'framer-motion';

function AboutPage() {
  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2>About HabitDot</h2>
      <p>
        HabitDot was created as a final year project for the TYBCA course. It's a simple yet powerful tool designed to help you build better habits and achieve your goals.
      </p>
      <p>
        Our philosophy is that small, consistent actions lead to big results. With HabitDot, you can easily track your daily habits, monitor your progress with a beautiful calendar view, and stay motivated with features like streak counters.
      </p>
      <p>
        This application is built using the MERN stack (MongoDB, Express.js, React, Node.js) and features a modern, responsive design with cool animations to make your habit-tracking journey enjoyable.
      </p>
      <p>
        Thank you for using HabitDot!
      </p>
    </motion.div>
  );
}

export default AboutPage;