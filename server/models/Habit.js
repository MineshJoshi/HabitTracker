import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  // Naya field add kiya
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
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