import Booking from "../models/Booking.js";

export const createManualBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error creating booking" });
  }
};

export const getBookings = async (req, res) => {
  const list = await Booking.find().sort({ createdAt: -1 });
  res.json(list);
};

export const getBooking = async (req, res) => {
  const item = await Booking.findById(req.params.id);
  res.json(item);
};

export const deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ msg: "Booking removed" });
};
