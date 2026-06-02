const User = require("../models/User");
const Package = require("../models/Package");
const Booking = require("../models/Booking");

const getPublicStats = async (req, res) => {
  try {
    const happyTravelers = await User.countDocuments({
      role: "user",
    });

    const tourPackages = await Package.countDocuments({
      status: "active",
    });

    const verifiedPlanners = await User.countDocuments({
      role: "planner",
      plannerStatus: "approved",
    });

    const totalBookings = await Booking.countDocuments();

    const destinations = await Package.distinct("destination", {
      status: "active",
    });

    res.status(200).json({
      happyTravelers,
      tourPackages,
      verifiedPlanners,
      totalBookings,
      destinations: destinations.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPublicStats,
};