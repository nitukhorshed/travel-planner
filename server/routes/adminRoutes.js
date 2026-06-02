console.log("✅ adminRoutes.js loaded");
const express = require("express");

const {
  getAllPlanners,
  approvePlanner,
  rejectPlanner,
  getAllPlannerProfiles,
  verifyPlannerProfile,
  unverifyPlannerProfile,
  getAdminStats,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Admin routes working"
    });
});

router.get(
  "/planners",
  protect,
  isAdmin,
  getAllPlanners
);

router.put(
  "/planners/:id/approve",
  protect,
  isAdmin,
  approvePlanner
);

router.put(
  "/planners/:id/reject",
  protect,
  isAdmin,
  rejectPlanner
);

router.get(
  "/planner-profiles",
  protect,
  isAdmin,
  getAllPlannerProfiles
);

router.put(
  "/planner-profiles/:id/verify",
  protect,
  isAdmin,
  verifyPlannerProfile
);

router.put(
  "/planner-profiles/:id/unverify",
  protect,
  isAdmin,
  unverifyPlannerProfile
);

router.get(
  "/stats",
  protect,
  isAdmin,
  getAdminStats
);

module.exports = router;