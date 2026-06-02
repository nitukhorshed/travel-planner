const express = require("express");

const {
  createBooking,
  getMyBookings,
  getPlannerBookings,
  approveBooking,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const {
  isPlanner,
  isApprovedPlanner,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// User routes
router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

// Planner routes
router.get(
  "/planner-bookings",
  protect,
  isPlanner,
  isApprovedPlanner,
  getPlannerBookings
);

router.put(
  "/:id/approve",
  protect,
  isPlanner,
  isApprovedPlanner,
  approveBooking
);

router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;