import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  customerName: String,
  numberOfGuests: String,
  bookingDate: String,
  bookingTime: String,
  cuisinePreference: String,
  specialRequests: String,
  weatherInfo: Object,
  seatingPreference: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", BookingSchema);
