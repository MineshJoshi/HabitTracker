import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from '../api';

const getPast7Days = () => { /* ... code same rahega ... */ };

function TrackerPage({ token, viewHabitDetails }) {
  console.log("A. TrackerPage rendered. Token from props:", token);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const weekDates = getPast7Days();

  useEffect(() => {
    console.log("B. TrackerPage useEffect triggered.");
    if (token) {
        console.log("C. Token exists, calling fetchHabits...");
        fetchHabits();
    } else {
        console.log("C. No token found, NOT fetching habits.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchHabits = async () => {
    setIsLoading(true);
    console.log("D. Inside fetchHabits, about to make API call.");
    try {
      const response = await api.get('/habits');
      console.log("E. API call successful, data received:", response.data);
      setHabits(response.data);
    } catch (error) { 
        console.error("E. API call FAILED:", error);
        if (error.code === "ERR_NETWORK") {
            alert("Could not connect to the server. It might be waking up. Please try refreshing in a minute.");
        }
    } 
    finally { setIsLoading(false); }
  };

  // ... (baki saare functions same rahenge) ...
  const addHabit = async (e) => { /* ... */ };
  const deleteHabit = async (habitId) => { /* ... */ };
  const updateHabitStatus = async (habitId, date, currentStatus) => { /* ... */ };
  const getStatusForDate = (habit, date) => { /* ... */ };

  return (
    // ... (poora JSX same rahega) ...
  );
}

export default TrackerPage;
