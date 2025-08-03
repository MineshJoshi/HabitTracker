import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import habitRoutes from "./routes/habits.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS ko update kiya taaki sirf aapki live website se request aa sake
app.use(cors({
  origin: 'https://habit-tracker-alpha-murex.vercel.app' 
}));

// Use routes
app.use("/habits", habitRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(error.message));
