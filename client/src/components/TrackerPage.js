import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from '../api';

const getPast7Days = () => { const dates = []; for (let i = 6; i >= 0; i--) { const date = new Date(); date.setDate(date.getDate() - i); dates.push(date); } return dates; };

function TrackerPage({ viewHabitDetails }) {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [goal, setGoal] = useState(""); // Goal ke liye naya state
  const [isLoading, setIsLoading] = useState(true);
  const weekDates = getPast7Days();

  useEffect(() => { fetchHabits(); }, []);

  const fetchHabits = async () => { /* ... (code same rahega) ... */ };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit) return;
    const response = await api.post('/habits', { name: newHabit, goal }); // Goal ko request me bheja
    setHabits([response.data, ...habits]);
    setNewHabit("");
    setGoal(""); // Input ko reset kiya
  };

  const deleteHabit = async (habitId) => { /* ... (code same rahega) ... */ };
  const updateHabitStatus = async (habitId, date, currentStatus) => { /* ... (code same rahega) ... */ };
  const getStatusForDate = (habit, date) => { /* ... (code same rahega) ... */ };

  return (
    <div className="app-container">
      <h2 className="page-title">Your Habits</h2>
      <form onSubmit={addHabit} className="add-habit-form">
        <input type="text" value={newHabit} onChange={(e) => setNewHabit(e.target.value)} placeholder="Add a new habit..." className="habit-input" />
        <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Goal (days)" className="goal-input" />
        <button type="submit">Add</button>
      </form>
      <div className="habit-tracker">
        {isLoading ? ( <div className="status-message">Loading...</div> ) : habits.length === 0 ? ( <div className="status-message">No habits yet.</div> ) : (
          <>
            <div className="header-row">
              <div className="habit-name-header">Habit</div>
              <div className="date-headers-container">
                {weekDates.map((date) => (
                  <div key={date} className="date-header">
                    <span className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="day-number">{date.getDate()}</span>
                  </div>
                ))}
              </div>
            </div>
            <AnimatePresence>
              {habits.map((habit) => (
                <motion.div key={habit._id} className={`habit-row ${habit.isCompleted ? 'completed' : ''}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="habit-name">
                    <span className="habit-name-text" onClick={() => viewHabitDetails(habit._id)}>
                      {habit.name}
                      {habit.streak > 0 && ( <span className="streak-counter">🔥 {habit.streak}</span> )}
                    </span>
                    {habit.goal > 0 && (
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${(habit.progress / habit.goal) * 100}%` }}></div>
                        <span className="progress-text">{habit.progress}/{habit.goal} days</span>
                      </div>
                    )}
                    <button onClick={() => deleteHabit(habit._id)} className="delete-btn">🗑️</button>
                  </div>
                  <div className="status-boxes-container">
                    {weekDates.map((date) => (
                      <motion.div key={date.toISOString()} className={`status-box ${getStatusForDate(habit, date.toISOString().split('T')[0])}`}
                        onClick={() => updateHabitStatus(habit._id, date.toISOString().split('T')[0], getStatusForDate(habit, date.toISOString().split('T')[0]))}
                        whileTap={{ scale: 0.9 }}>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

export default TrackerPage;
