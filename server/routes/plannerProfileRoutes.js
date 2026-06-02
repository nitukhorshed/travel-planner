const express = require("express");

const {
  createPlannerProfile,
  getMyPlannerProfile,
  updatePlannerProfile,
  getPlannerProfileById,
  getFeaturedPlanners,
} = require("../controllers/plannerProfileController");

const { protect } = require("../middleware/authMiddleware");
const {
  isPlanner,
  isApprovedPlanner,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  isPlanner,
  isApprovedPlanner,
  createPlannerProfile
);

router.get(
  "/me",
  protect,
  isPlanner,
  isApprovedPlanner,
  getMyPlannerProfile
);

router.put(
  "/",
  protect,
  isPlanner,
  isApprovedPlanner,
  updatePlannerProfile
);

router.get("/featured", getFeaturedPlanners);
router.get("/:plannerId", getPlannerProfileById);

module.exports = router;