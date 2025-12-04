import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Voice Assistant Backend Running...");
});

// API Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/weather", weatherRoutes);

app.listen(9000, () => console.log("Server running at http://localhost:9000"));
