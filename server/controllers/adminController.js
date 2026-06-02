const User = require("../models/User");
const Package = require("../models/Package");
const Booking = require("../models/Booking");
const PlannerProfile = require("../models/PlannerProfile");

// Admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const totalPlanners = await User.countDocuments({ role: "planner" });

    const pendingPlanners = await User.countDocuments({
      role: "planner",
      plannerStatus: "pending",
    });

    const approvedPlanners = await User.countDocuments({
      role: "planner",
      plannerStatus: "approved",
    });

    const rejectedPlanners = await User.countDocuments({
      role: "planner",
      plannerStatus: "rejected",
    });

    const totalPackages = await Package.countDocuments();

    const activePackages = await Package.countDocuments({
      status: "active",
    });

    const inactivePackages = await Package.countDocuments({
      status: "inactive",
    });

    const featuredPackages = await Package.countDocuments({
      featured: true,
    });

    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      bookingStatus: "pending",
    });

    const approvedBookings = await Booking.countDocuments({
      bookingStatus: "approved",
    });

    const cancelledBookings = await Booking.countDocuments({
      bookingStatus: "cancelled",
    });

    res.status(200).json({
      totalUsers,
      totalPlanners,
      pendingPlanners,
      approvedPlanners,
      rejectedPlanners,

      totalPackages,
      activePackages,
      inactivePackages,
      featuredPackages,

      totalBookings,
      pendingBookings,
      approvedBookings,
      cancelledBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all planners
const getAllPlanners = async (req, res) => {
  try {
    const planners = await User.find({
      role: "planner",
    }).select("-password");

    res.status(200).json(planners);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Approve planner
const approvePlanner = async (req, res) => {
  try {
    const planner = await User.findById(req.params.id);

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found",
      });
    }

    planner.plannerStatus = "approved";
    await planner.save();

    res.status(200).json({
      message: "Planner approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Reject planner
const rejectPlanner = async (req, res) => {
  try {
    const planner = await User.findById(req.params.id);

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found",
      });
    }

    planner.plannerStatus = "rejected";
    await planner.save();

    res.status(200).json({
      message: "Planner rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all planner profiles
const getAllPlannerProfiles = async (req, res) => {
  try {
    const profiles = await PlannerProfile.find()
      .populate(
        "plannerId",
        "fullName email organizationName plannerStatus"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify planner profile
const verifyPlannerProfile = async (req, res) => {
  try {
    const profile = await PlannerProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        message: "Planner profile not found",
      });
    }

    profile.verified = true;
    await profile.save();

    res.status(200).json({
      message: "Planner profile verified successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove verification
const unverifyPlannerProfile = async (req, res) => {
  try {
    const profile = await PlannerProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        message: "Planner profile not found",
      });
    }

    profile.verified = false;
    await profile.save();

    res.status(200).json({
      message: "Planner profile unverified successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,

  getAllPlanners,
  approvePlanner,
  rejectPlanner,

  getAllPlannerProfiles,
  verifyPlannerProfile,
  unverifyPlannerProfile,
};