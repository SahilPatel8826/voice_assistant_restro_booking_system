import express from "express";
import {
  createManualBooking,
  getBookings,
  getBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Manual booking (used by voice assistant frontend)
router.post("/manual", createManualBooking);

// CRUD operations
router.get("/", (req, res) => {
  res.send("Booking route working");
});
router.get("/", getBookings);
router.get("/:id", getBooking);
router.delete("/:id", deleteBooking);

export default router;
