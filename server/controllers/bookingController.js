const Booking = require("../models/Booking");
const Package = require("../models/Package");

// User creates booking
const createBooking = async (req, res) => {
  try {
    const { packageId, numberOfTravelers, specialRequest } = req.body || {};
    if (!packageId || !numberOfTravelers)
    {
      return res.status(400).json({
        message: "packageId and numberOfTravelers are required",
            });
    }

    const selectedPackage = await Package.findById(packageId);

    if (!selectedPackage) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    if (selectedPackage.status !== "active") {
      return res.status(400).json({
        message: "This package is not available for booking",
      });
    }

    if (numberOfTravelers > selectedPackage.availableSeats) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    const booking = await Booking.create({
      packageId: selectedPackage._id,
      userId: req.user._id,
      plannerId: selectedPackage.plannerId,
      numberOfTravelers,
      totalAmount: selectedPackage.price * numberOfTravelers,
      specialRequest: specialRequest || "",
      bookingStatus: "pending",
    });

    res.status(201).json({
      message: "Booking request submitted successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// User views own bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate("packageId", "title destination price duration images")
      .populate("plannerId", "organizationName email")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Planner views bookings for own packages
const getPlannerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      plannerId: req.user._id,
    })
      .populate("packageId", "title destination price duration")
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Planner approves booking
const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.plannerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can approve only your own package bookings",
      });
    }

    if (booking.bookingStatus !== "pending") {
      return res.status(400).json({
        message: "Only pending bookings can be approved",
      });
    }

    const selectedPackage = await Package.findById(booking.packageId);

    if (!selectedPackage) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    if (selectedPackage.availableSeats < booking.numberOfTravelers) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    selectedPackage.availableSeats -= booking.numberOfTravelers;
    selectedPackage.bookingCount += booking.numberOfTravelers;

    booking.bookingStatus = "approved";

    await selectedPackage.save();
    await booking.save();

    res.status(200).json({
      message: "Booking approved successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Planner cancels booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      booking.plannerId.toString() !== req.user._id.toString() &&
      booking.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to cancel this booking",
      });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    const selectedPackage = await Package.findById(booking.packageId);

    if (booking.bookingStatus === "approved" && selectedPackage) {
      selectedPackage.availableSeats += booking.numberOfTravelers;
      selectedPackage.bookingCount -= booking.numberOfTravelers;

      if (selectedPackage.bookingCount < 0) {
        selectedPackage.bookingCount = 0;
      }

      await selectedPackage.save();
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getPlannerBookings,
  approveBooking,
  cancelBooking,
};