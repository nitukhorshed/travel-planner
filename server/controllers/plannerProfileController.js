const PlannerProfile = require("../models/PlannerProfile");

// Create planner profile
const createPlannerProfile = async (req, res) => {
  try {
    const existingProfile = await PlannerProfile.findOne({
      plannerId: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Planner profile already exists",
      });
    }

    const profile = await PlannerProfile.create({
      plannerId: req.user._id,
      organizationName: req.body.organizationName || req.user.organizationName,
      logo: req.body.logo || "",
      coverImage: req.body.coverImage || "",
      description: req.body.description || "",
      phone: req.body.phone || "",
      website: req.body.website || "",
      address: req.body.address || "",
      verified: false,
    });

    res.status(201).json({
      message: "Planner profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get own planner profile
const getMyPlannerProfile = async (req, res) => {
  try {
    const profile = await PlannerProfile.findOne({
      plannerId: req.user._id,
    }).populate("plannerId", "fullName email plannerStatus");

    if (!profile) {
      return res.status(404).json({
        message: "Planner profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFeaturedPlanners = async (req, res) => {
  try {
    const planners = await PlannerProfile.find({
      verified: true,
    })
      .populate(
        "plannerId",
        "fullName email organizationName plannerStatus"
      )
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json(planners);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update planner profile
const updatePlannerProfile = async (req, res) => {
  try {
    const profile = await PlannerProfile.findOne({
      plannerId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Planner profile not found",
      });
    }

    const allowedFields = [
      "organizationName",
      "logo",
      "coverImage",
      "description",
      "phone",
      "website",
      "address",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    res.status(200).json({
      message: "Planner profile updated successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Public - get planner profile by planner user id
const getPlannerProfileById = async (req, res) => {
  try {
    const profile = await PlannerProfile.findOne({
      plannerId: req.params.plannerId,
    }).populate("plannerId", "fullName email plannerStatus");

    if (!profile) {
      return res.status(404).json({
        message: "Planner profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPlannerProfile,
  getMyPlannerProfile,
  updatePlannerProfile,
  getPlannerProfileById,
  getFeaturedPlanners,
};