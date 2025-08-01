import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import habitRoutes from "./routes/habits.js";
import userRoutes from "./routes/users.js"; // Naya route import kiya

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Use routes
app.use("/habits", habitRoutes);
app.use("/users", userRoutes); // Naye route ko use kiya

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(error.message));