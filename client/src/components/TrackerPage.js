import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from '../api';

const getPast7Days = () => { const dates = []; for (let i = 6; i >= 0; i--) { const date = new Date(); date.setDate(date.getDate() - i); dates.push(date); } return dates; };

function TrackerPage({ token, viewHabitDetails }) {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const weekDates = getPast7Days();

  useEffect(() => {
    if (token) {
        fetchHabits();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/habits');
      setHabits(response.data);
    } catch (error) { 
        console.error("Error fetching habits:", error);
    } 
    finally { setIsLoading(false); }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit) return;
    const response = await api.post('/habits', { name: newHabit, goal });
    setHabits([response.data, ...habits]);
    setNewHabit("");
    setGoal("");
  };

  const deleteHabit = async (habitId) => {
    const originalHabits = [...habits];
    setHabits(habits.filter((h) => h._id !== habitId));
    try {
      await api.delete(`/habits/${habitId}`);
    } catch (error) {
      setHabits(originalHabits);
      console.error("Failed to delete habit");
    }
  };

  const updateHabitStatus = async (habitId, date, currentStatus) => {
    const newStatus = currentStatus === "done" ? "not_done" : currentStatus === "not_done" ? "none" : "done";
    const originalHabits = JSON.parse(JSON.stringify(habits));
    const newHabits = habits.map(habit => {
        if (habit._id === habitId) {
            const dateExists = habit.dates.some(d => d.date === date);
            let updatedDates;
            if (dateExists) {
                updatedDates = habit.dates.map(d => d.date === date ? { ...d, status: newStatus } : d);
            } else {
                updatedDates = [...habit.dates, { date, status: newStatus }];
            }
            return { ...habit, dates: updatedDates };
        }
        return habit;
    });
    setHabits(newHabits);
    try {
        const { data: updatedHabitFromServer } = await api.patch(`/habits/${habitId}`, { date, status: newStatus });
        setHabits(currentHabits => currentHabits.map(h => h._id === habitId ? updatedHabitFromServer : h));
    } catch (error) {
        console.error("Failed to update status", error);
        setHabits(originalHabits);
    }
  };
  
  const getStatusForDate = (habit, date) => { const record = habit.dates.find((d) => d.date === date); return record ? record.status : "none"; };

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
                  <div key={date.toISOString()} className="date-header">
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
                      <span>{habit.name}</span>
                      {habit.streak > 0 && ( <span className="streak-counter">🔥 {habit.streak}</span> )}
                    </span>
                    <button onClick={() => deleteHabit(habit._id)} className="delete-btn">🗑️</button>
                  </div>
                  {habit.goal > 0 && (
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${(habit.progress / habit.goal) * 100}%` }}></div>
                        <span className="progress-text">{habit.progress}/{habit.goal} days</span>
                      </div>
                    )}
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
