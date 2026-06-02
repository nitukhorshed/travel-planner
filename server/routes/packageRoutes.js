const express = require("express");

const {
  createPackage,
  getAllPackages,
  getMyPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getTrendingPackages,
  getFeaturedPackages,
} = require("../controllers/packageController");

const { protect } = require("../middleware/authMiddleware");
const {
  isPlanner,
  isApprovedPlanner,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getAllPackages);

router.get(
  "/my-packages",
  protect,
  isPlanner,
  isApprovedPlanner,
  getMyPackages
);

router.get("/trending", getTrendingPackages);
router.get("/featured", getFeaturedPackages);
router.get("/:id", getPackageById);

router.post(
  "/",
  protect,
  isPlanner,
  isApprovedPlanner,
  createPackage
);

router.put(
  "/:id",
  protect,
  isPlanner,
  isApprovedPlanner,
  updatePackage
);

router.delete(
  "/:id",
  protect,
  isPlanner,
  isApprovedPlanner,
  deletePackage
);

module.exports = router;