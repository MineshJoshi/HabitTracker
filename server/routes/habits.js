import express from "express";
import Habit from "../models/Habit.js";
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper functions
const calculateStreak = (dates) => { /* ... (code same rahega) ... */ };
const calculateProgress = (habit) => {
    const doneCount = habit.dates.filter(d => d.status === 'done').length;
    if (habit.goal > 0 && !habit.isCompleted) {
        if (doneCount >= habit.goal) {
            habit.isCompleted = true;
        }
    }
    return { doneCount, isCompleted: habit.isCompleted };
};

// GET all habits
router.get("/", auth, async (req, res) => {
  try {
    const habitsFromDb = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    const updatePromises = habitsFromDb.map(async (habit) => {
      // ... (Automatic 'not done' logic same rahega) ...
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const habitStartDate = new Date(habit.createdAt); habitStartDate.setHours(0, 0, 0, 0);
      let wasModified = false;
      for (let d = new Date(habitStartDate); d < today; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        const recordExists = habit.dates.some(record => record.date === dateString);
        if (!recordExists) {
          habit.dates.push({ date: dateString, status: 'not_done' });
          wasModified = true;
        }
      }
      if (wasModified) {
        habit.dates.sort((a, b) => new Date(a.date) - new Date(b.date));
        await habit.save();
      }
      return habit;
    });

    const updatedHabits = await Promise.all(updatePromises);

    const habitsWithDetails = updatedHabits.map(habit => {
        const habitObject = habit.toObject();
        habitObject.streak = calculateStreak(habitObject.dates);
        const { doneCount } = calculateProgress(habitObject);
        habitObject.progress = doneCount;
        return habitObject;
    });

    res.status(200).json(habitsWithDetails);
  } catch (error) {
    console.error("Error in GET /habits:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new habit
router.post("/", auth, async (req, res) => {
  const { name, goal } = req.body; // Goal ko request se liya
  try {
    const newHabit = new Habit({
      name,
      goal: parseInt(goal) || 0, // Goal ko save kiya
      user: req.user.id,
      dates: []
    });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// PATCH (update) a habit
router.patch("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { date, status } = req.body;
    try {
        let habit = await Habit.findById(id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });
        if (habit.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

        const dateEntry = habit.dates.find((d) => d.date === date);
        if (dateEntry) {
            dateEntry.status = status;
        } else {
            habit.dates.push({ date, status });
        }
        
        // Progress aur completion status update kiya
        const { isCompleted } = calculateProgress(habit);
        habit.isCompleted = isCompleted;

        await habit.save();
        
        const updatedHabitObject = habit.toObject();
        updatedHabitObject.streak = calculateStreak(updatedHabitObject.dates);
        updatedHabitObject.progress = updatedHabitObject.dates.filter(d => d.status === 'done').length;
        res.json(updatedHabitObject);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ... (DELETE aur GET by ID routes same rahenge) ...
router.delete("/:id", auth, async (req, res) => { /* ... */ });
router.get("/:id", auth, async (req, res) => { /* ... */ });

export default router;
