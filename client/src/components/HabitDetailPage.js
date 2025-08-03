import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import api from '../api';

function HabitDetailPage({ habitId, backToTracker }) {
    const [habit, setHabit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHabitDetails = async () => {
            try {
                const res = await api.get(`/habits/${habitId}`);
                setHabit(res.data);
            } catch (error) { console.error("Error fetching habit details", error); } 
            finally { setLoading(false); }
        };
        fetchHabitDetails();
    }, [habitId]);
    
    const tileClassName = ({ date, view }) => { if (view === 'month' && habit) { const dateString = date.toISOString().split('T')[0]; const record = habit.dates.find(d => d.date === dateString); if (record) { return `calendar-tile ${record.status}`; } } return null; };

    if (loading) { return <div className="status-message">Loading Details...</div>; }
    if (!habit) { return <div className="status-message">Could not load habit details.</div>; }

    return ( <motion.div className="detail-page-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><button onClick={backToTracker} className="back-button">← Back to Tracker</button><h1>{habit.name}</h1><div className="calendar-container"><Calendar tileClassName={tileClassName} /></div></motion.div> );
}
export default HabitDetailPage;
