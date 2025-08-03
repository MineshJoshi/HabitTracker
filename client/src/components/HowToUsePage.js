import React from 'react';
import { motion } from 'framer-motion';

function HowToUsePage() {
  return (
    <motion.div
      className="about-container" // We will use the same styling as the "About Us" page
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2>How to Use HabitDot</h2>
      
      <h4>1. Register Your Account</h4>
      <p>
        First, create a new account. Click on "Register" in the Navbar and enter your Full Name, Email, Username, and a secure Password. This will create your personal space.
      </p>

      <h4>2. Login to Your Dashboard</h4>
      <p>
        After registering, go to the "Login" page and log in with your Username and Password. Upon logging in, you will be taken to your personal Habit Tracker.
      </p>

      <h4>3. Add a New Habit</h4>
      <p>
        To add a new habit, type the name of the habit in the input box at the top (e.g., "Morning Walk" or "Read a book") and click the "Add" button. Your habit will be added to the list.
      </p>

      <h4>4. Track Your Daily Progress</h4>
      <p>
        In front of each habit, you will see boxes for the last 7 days. You can click on each day's box to change its status:
        <ul>
            <li><strong>Green (Done):</strong> You completed the habit.</li>
            <li><strong>Red (Not Done):</strong> You did not complete the habit.</li>
            <li><strong>Grey (None):</strong> No status has been set.</li>
        </ul>
        If you forget to mark a day, the app will automatically mark it as 'Not Done' (Red) the next time you log in.
      </p>

      <h4>5. View Detailed History</h4>
      <p>
        By clicking on the name of any habit, you can view its complete calendar. This will give you an overview of your progress for the entire month.
      </p>

      <h4>6. Stay Motivated!</h4>
      <p>
        When you complete a habit for consecutive days, you will see a "Streak Counter" (🔥). Try not to break your streak!
      </p>
    </motion.div>
  );
}

export default HowToUsePage;
