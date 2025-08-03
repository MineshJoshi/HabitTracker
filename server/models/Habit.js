import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  goal: { // Naya field: Kitne din ka target hai
    type: Number,
    default: 0, // 0 ka matlab koi specific goal nahi
  },
  isCompleted: { // Naya field: Goal poora hua ya nahi
    type: Boolean,
    default: false,
  },
  dates: [
    {
      date: String,
      status: String,
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
