import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from '../api'; // Naya import

const getPast7Days = () => { const dates = []; for (let i = 6; i >= 0; i--) { const date = new Date(); date.setDate(date.getDate() - i); dates.push(date.toISOString().split("T")[0]); } return dates; };

function TrackerPage({ viewHabitDetails }) {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const weekDates = getPast7Days();

  useEffect(() => { fetchHabits(); }, []);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/habits');
      setHabits(response.data);
    } catch (error) { console.error("Error fetching habits:", error); } 
    finally { setIsLoading(false); }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit) return;
    const response = await api.post('/habits', { name: newHabit });
    setHabits([response.data, ...habits]);
    setNewHabit("");
  };

  const deleteHabit = async (habitId) => {
    await api.delete(`/habits/${habitId}`);
    setHabits(habits.filter((h) => h._id !== habitId));
  };

  const updateHabitStatus = async (habitId, date, currentStatus) => {
    const newStatus = currentStatus === "done" ? "not_done" : currentStatus === "not_done" ? "none" : "done";
    const { data: updatedHabit } = await api.patch(`/habits/${habitId}`, { date, status: newStatus });
    setHabits(habits.map(h => h._id === habitId ? updatedHabit : h));
  };

  const getStatusForDate = (habit, date) => { const record = habit.dates.find((d) => d.date === date); return record ? record.status : "none"; };

  return ( <div className="app-container"><h2 className="page-title">Your Habits</h2><form onSubmit={addHabit} className="add-habit-form"><input type="text" value={newHabit} onChange={(e) => setNewHabit(e.target.value)} placeholder="Add a new habit..." /><button type="submit">Add</button></form><div className="habit-tracker">{isLoading ? ( <div className="status-message">Loading habits... ⏳</div> ) : habits.length === 0 ? ( <div className="status-message">No habits yet. Add one to get started! ✨</div> ) : ( <><div className="header-row"><div className="habit-name-header">Habit</div>{weekDates.map((date) => ( <div key={date} className="date-header">{new Date(date).getDate()}</div> ))}</div><AnimatePresence>{habits.map((habit) => ( <motion.div key={habit._id} className="habit-row" layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}><div className="habit-name"><span className="habit-name-text" onClick={() => viewHabitDetails(habit._id)}>{habit.name}{habit.streak > 0 && ( <span className="streak-counter">🔥 {habit.streak}</span> )}</span><button onClick={() => deleteHabit(habit._id)} className="delete-btn">🗑️</button></div>{weekDates.map((date) => ( <motion.div key={date} className={`status-box ${getStatusForDate(habit, date)}`} onClick={() => updateHabitStatus(habit._id, date, getStatusForDate(habit, date))} whileTap={{ scale: 0.9, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}></motion.div> ))}</motion.div> ))}</AnimatePresence></> )}</div></div> );
}
export default TrackerPage;