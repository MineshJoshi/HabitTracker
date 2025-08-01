import express from "express";
import Habit from "../models/Habit.js";
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper function to calculate streak
const calculateStreak = (dates) => {
    if (dates.length === 0) return 0;
    const doneDates = dates.filter((d) => d.status === "done").map((d) => new Date(d.date)).sort((a, b) => b - a);
    if (doneDates.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (doneDates[0].getTime() !== today.getTime() && doneDates[0].getTime() !== yesterday.getTime()) return 0;
    streak = 1;
    let lastDate = doneDates[0];
    for (let i = 1; i < doneDates.length; i++) {
        const currentDate = doneDates[i];
        const expectedPreviousDate = new Date(lastDate);
        expectedPreviousDate.setDate(lastDate.getDate() - 1);
        if (currentDate.getTime() === expectedPreviousDate.getTime()) {
            streak++;
            lastDate = currentDate;
        } else {
            break;
        }
    }
    return streak;
};

// GET all habits for a user (with automatic 'not done' logic)
router.get("/", auth, async (req, res) => {
  try {
    const habitsFromDb = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Promise array for all the updates
    const updatePromises = habitsFromDb.map(async (habit) => {
      const habitStartDate = new Date(habit.createdAt);
      habitStartDate.setHours(0, 0, 0, 0);

      let wasModified = false;

      // Loop from the day the habit was created until yesterday
      for (let d = new Date(habitStartDate); d < today; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];

        // Check if a record for this date already exists
        const recordExists = habit.dates.some(record => record.date === dateString);

        if (!recordExists) {
          // If no record, it means the user missed it. Mark as 'not_done'.
          habit.dates.push({ date: dateString, status: 'not_done' });
          wasModified = true;
        }
      }

      if (wasModified) {
        // Sort dates to maintain order
        habit.dates.sort((a, b) => new Date(a.date) - new Date(b.date));
        await habit.save();
      }
      return habit;
    });

    // Wait for all habits to be processed
    const updatedHabits = await Promise.all(updatePromises);

    const habitsWithStreak = updatedHabits.map(habit => {
        const habitObject = habit.toObject();
        habitObject.streak = calculateStreak(habitObject.dates);
        return habitObject;
    });

    res.status(200).json(habitsWithStreak);
  } catch (error) {
    console.error("Error in GET /habits:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new habit
router.post("/", auth, async (req, res) => {
  const { name } = req.body;
  try {
    const newHabit = new Habit({
      name,
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
        await habit.save();
        const updatedHabitObject = habit.toObject();
        updatedHabitObject.streak = calculateStreak(updatedHabitObject.dates);
        res.json(updatedHabitObject);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE a habit
router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        let habit = await Habit.findById(id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });
        if (habit.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

        await Habit.findByIdAndDelete(id);
        res.json({ message: "Habit deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// GET a single habit by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    if (habit.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });
    
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;