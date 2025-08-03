import React from 'react';
import { motion } from 'framer-motion';

function HowToUsePage() {
  return (
    <motion.div
      className="about-container" // Hum "About Us" page jaisi hi style use karenge
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2>How to Use HabitDot</h2>
      
      <h4>1. Register Your Account</h4>
      <p>
        Sabse pehle, ek naya account banayein. Navbar me "Register" par click karein aur apna Full Name, Email, Username, aur ek surakshit Password daalein. Yeh aapka personal space banayega.
      </p>

      <h4>2. Login to Your Dashboard</h4>
      <p>
        Register karne ke baad, "Login" page par jaayein aur apne Username aur Password se login karein. Login karte hi aap apne personal Habit Tracker par pahunch jayenge.
      </p>

      <h4>3. Add a New Habit</h4>
      <p>
        Apni nayi aadat (habit) add karne ke liye, upar diye gaye box me aadat ka naam likhein (jaise "Morning Walk" ya "Read a book") aur "Add" button par click karein. Aapki aadat list me jud jayegi.
      </p>

      <h4>4. Track Your Daily Progress</h4>
      <p>
        Har aadat ke saamne aapko pichhle 7 dinon ke box dikhenge. Har din ke box par click karke aap uska status badal sakte hain:
        <ul>
            <li><strong>Green (Done):</strong> Aapne aadat poori ki.</li>
            <li><strong>Red (Not Done):</strong> Aap aadat poori nahi kar paaye.</li>
            <li><strong>Grey (None):</strong> Koi status nahi.</li>
        </ul>
        Agar aap koi din bhool jaate hain, toh agle din login karne par app use apne aap 'Not Done' (Red) mark kar degi.
      </p>

      <h4>5. View Detailed History</h4>
      <p>
        Kisi bhi aadat ke naam par click karke aap uska poora calendar dekh sakte hain. Isse aapko apne poore mahine ki progress ka pata chalega.
      </p>

      <h4>6. Stay Motivated!</h4>
      <p>
        Jab aap koi aadat lagatar poori karte hain, toh aapko ek "Streak Counter" (🔥) dikhega. Koshish karein ki aapki streak toote nahi!
      </p>
    </motion.div>
  );
}

export default HowToUsePage;
